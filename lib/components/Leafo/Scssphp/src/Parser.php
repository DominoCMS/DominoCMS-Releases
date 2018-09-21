<?php
/**
 * SCSSPHP
 *
 * @copyright 2012-2015 Leaf Corcoran
 *
 * @license http://opensource.org/licenses/MIT MIT
 *
 * @link http://leafo.github.io/scssphp
 */

namespace Leafo\ScssPhp;

use Leafo\ScssPhp\Block;
use Leafo\ScssPhp\Compiler;
use Leafo\ScssPhp\Exception\ParserException;
use Leafo\ScssPhp\Node;
use Leafo\ScssPhp\Type;

/**
 * Parser
 *
 * @author Leaf Corcoran <leafot@gmail.com>
 */
class Parser
{
    const SOURCE_INDEX  = -1;
    const SOURCE_LINE   = -2;
    const SOURCE_COLUMN = -3;

    /**
     * @var array
     */
    protected static $precedence = [
        '='   => 0,
        'or'  => 1,
        'and' => 2,
        '=='  => 3,
        '!='  => 3,
        '<=>' => 3,
        '<='  => 4,
        '>='  => 4,
        '<'   => 4,
        '>'   => 4,
        '+'   => 5,
        '-'   => 5,
        '*'   => 6,
        '/'   => 6,
        '%'   => 6,
    ];

    protected static $commentPattern;
    protected static $operatorPattern;
    protected static $whitePattern;

    private $sourceName;
    private $sourceIndex;
    private $sourcePositions;
    private $charset;
    private $count;
    private $env;
    private $inParens;
    private $eatWhiteDefault;
    private $buffer;
    private $utf8;
    private $encoding;
    private $patternModifiers;

    /**
     * Constructor
     *
     * @api
     *
     * @param string  $sourceName
     * @param integer $sourceIndex
     * @param string  $encoding
     */
    public function __construct($sourceName, $sourceIndex = 0, $encoding = 'utf-8')
    {
        $this->sourceName       = $sourceName ?: '(stdin)';
        $this->sourceIndex      = $sourceIndex;
        $this->charset          = null;
        $this->utf8             = ! $encoding || strtolower($encoding) === 'utf-8';
        $this->patternModifiers = $this->utf8 ? 'Aisu' : 'Ais';

        if (empty(self::$operatorPattern)) {
            self::$operatorPattern = '([*\/%+-]|[!=]\=|\>\=?|\<\=\>|\<\=?|and|or)';

            $commentSingle      = '\/\/';
            $commentMultiLeft   = '\/\*';
            $commentMultiRight  = '\*\/';

            self::$commentPattern = $commentMultiLeft . '.*?' . $commentMultiRight;
            self::$whitePattern = $this->utf8
                ? '/' . $commentSingle . '[^\n]*\s*|(' . self::$commentPattern . ')\s*|\s+/AisuS'
                : '/' . $commentSingle . '[^\n]*\s*|(' . self::$commentPattern . ')\s*|\s+/AisS';
        }
    }

    /**
     * Get source file name
     *
     * @api
     *
     * @return string
     */
    public function getSourceName()
    {
        return $this->sourceName;
    }

    /**
     * Throw parser error
     *
     * @api
     *
     * @param string $msg
     *
     * @throws \Leafo\ScssPhp\Exception\ParserException
     */
    public function throwParseError($msg = 'parse error')
    {
        list($line, /* $column */) = $this->getSourcePosition($this->count);

        $loc = empty($this->sourceName) ? "line: $line" : "$this->sourceName on line $line";

        if ($this->peek("(.*?)(\n|$)", $m, $this->count)) {
            throw new ParserException("$msg: failed at `$m[1]` $loc");
        }

        throw new ParserException("$msg: $loc");
    }

    /**
     * Parser buffer
     *
     * @api
     *
     * @param string $buffer
     *
     * @return \Leafo\ScssPhp\Block
     */
    public function parse($buffer)
    {
        $this->count           = 0;
        $this->env             = null;
        $this->inParens        = false;
        $this->eatWhiteDefault = true;
        $this->buffer          = rtrim($buffer, "\x00..\x1f");

        $this->saveEncoding();
        $this->extractLineNumbers($buffer);

        $this->pushBlock(null); // root block
        $this->whitespace();
        $this->pushBlock(null);
        $this->popBlock();

        while ($this->parseChunk()) {
            ;
        }

        if ($this->count !== strlen($this->buffer)) {
            $this->throwParseError();
        }

        if (! empty($this->env->parent)) {
            $this->throwParseError('unclosed block');
        }

        if ($this->charset) {
            array_unshift($this->env->children, $this->charset);
        }

        $this->env->isRoot    = true;

        $this->restoreEncoding();

        return $this->env;
    }

    /**
     * Parse a value or value list
     *
     * @api
     *
     * @param string $buffer
     * @param string $out
     *
     * @return boolean
     */
    public function parseValue($buffer, &$out)
    {
        $this->count           = 0;
        $this->env             = null;
        $this->inParens        = false;
        $this->eatWhiteDefault = true;
        $this->buffer          = (string) $buffer;

        $this->saveEncoding();

        $list = $this->valueList($out);

        $this->restoreEncoding();

        return $list;
    }

    /**
     * Parse a selector or selector list
     *
     * @api
     *
     * @param string $buffer
     * @param string $out
     *
     * @return boolean
     */
    public function parseSelector($buffer, &$out)
    {
        $this->count           = 0;
        $this->env             = null;
        $this->inParens        = false;
        $this->eatWhiteDefault = true;
        $this->buffer          = (string) $buffer;

        $this->saveEncoding();

        $selector = $this->selectors($out);

        $this->restoreEncoding();

        return $selector;
    }

    /**
     * Parse a single chunk off the head of the buffer and append it to the
     * current parse environment.
     *
     * Returns false when the buffer is empty, or when there is an error.
     *
     * This function is called repeatedly until the entire document is
     * parsed.
     *
     * This parser is most similar to a recursive descent parser. Single
     * functions represent discrete grammatical rules for the language, and
     * they are able to capture the text that represents those rules.
     *
     * Consider the function Compiler::keyword(). (All parse functions are
     * structured the same.)
     *
     * The function takes a single reference argument. When calling the
     * function it will attempt to match a keyword on the head of the buffer.
     * If it is successful, it will place the keyword in the referenced
     * argument, advance the position in the buffer, and return true. If it
     * fails then it won't advance the buffer and it will return false.
     *
     * All of these parse functions are powered by Compiler::match(), which behaves
     * the same way, but takes a literal regular expression. Sometimes it is
     * more convenient to use match instead of creating a new function.
     *
     * Because of the format of the functions, to parse an entire string of
     * grammatical rules, you can chain them together using &&.
     *
     * But, if some of the rules in the chain succeed before one fails, then
     * the buffer position will be left at an invalid state. In order to
     * avoid this, Compiler::seek() is used to remember and set buffer positions.
     *
     * Before parsing a chain, use $s = $this->seek() to remember the current
     * position into $s. Then if a chain fails, use $this->seek($s) to
     * go back where we started.
     *
     * @return boolean
     */
    protected function parseChunk()
    {
        $s = $this->seek();

        // the directives
        if (isset($this->buffer[$this->count]) && $this->buffer[$this->count] === '@') {
            if ($this->literal('@at-root') &&
                ($this->selectors($selector) || true) &&
                ($this->map($with) || true) &&
                $this->literal('{')
            ) {
                $atRoot = $this->pushSpecialBlock(Type::T_AT_ROOT, $s);
                $atRoot->selector = $selector;
                $atRoot->with = $with;

                return true;
            }

            $this->seek($s);

            if ($this->literal('@media') && $this->mediaQueryList($mediaQueryList) && $this->literal('{')) {
                $media = $this->pushSpecialBlock(Type::T_MEDIA, $s);
                $media->queryList = $mediaQueryList[2];

                return true;
            }

            $this->seek($s);

            if ($this->literal('@mixin') &&
                $this->keyword($mixinName) &&
                ($this->argumentDef($args) || true) &&
                $this->literal('{')
            ) {
                $mixin = $this->pushSpecialBlock(Type::T_MIXIN, $s);
                $mixin->name = $mixinName;
                $mixin->args = $args;

                return true;
            }

            $this->seek($s);