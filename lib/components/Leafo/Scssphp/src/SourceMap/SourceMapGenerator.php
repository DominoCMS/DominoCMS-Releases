<?php
/**
 * SCSSPHP
 *
 * @copyright 2012-2018 Leaf Corcoran
 *
 * @license http://opensource.org/licenses/MIT MIT
 *
 * @link http://leafo.github.io/scssphp
 */

namespace Leafo\ScssPhp\SourceMap;

use Leafo\ScssPhp\Exception\CompilerException;

/**
 * Source Map Generator
 *
 * {@internal Derivative of oyejorge/less.php's lib/SourceMap/Generator.php, relicensed with permission. }}
 *
 * @author Josh Schmidt <oyejorge@gmail.com>
 * @author Nicolas FRANÇOIS <nicolas.francois@frog-labs.com>
 */
class SourceMapGenerator
{
    /**
     * What version of source map does the generator generate?
     */
    const VERSION = 3;

    /**
     * Array of default options
     *
     * @var array
     */
    protected $defaultOptions = array(
        // an optional source root, useful for relocating source files
        // on a server or removing repeated values in the 'sources' entry.
        // This value is prepended to the individual entries in the 'source' field.
        'sourceRoot' => '',

        // an optional name of the generated code that this source map is associated with.
        'sourceMapFilename' => null,

        // url of the map
        'sourceMapURL' => null,

        // absolute path to a file to write the map to
        'sourceMapWriteTo' => null,

        // output source contents?
        'outputSourceFiles' => false,

        // base path for filename normalization
        'sourceMapRootpath' => '',

        // base path for filename normalization
        'sourceMapBasepath' => ''
    );

    /**
     * The base64 VLQ encoder
     *
     * @var \Leafo\ScssPhp\SourceMap\Base64VLQEncoder
     */
    protected $encoder;

    /**
     * Array of mappings
     *
     * @var array
     */
    protected $mappings = array();

    /**
     * Array of contents map
     *
     * @var array
     */
    protected $contentsMap = array();

    /**
     * File to content map
     *
     * @var array
     */
    protected $sources = array();
    protected $source_keys = array();

    /**
     * @var array
     */
    private $options;

    public function __construct(array $options = [])
    {
        $this->options = array_merge($this->defaultOptions, $options);
        $this->encoder = new Base64VLQEncoder();
    }

    /**
     * Adds a mapping
     *
     * @param integer $generatedLine   The line number in generated file
     * @param integer $generatedColumn The column number in generated file
     * @param integer $originalLine    The line number in original file
     * @param integer $originalColumn  The column number in original file
     * @param string  $sourceFile      The original source file
     */
    public function addMapping($generatedLine, $generatedColumn, $originalLine, $originalColumn, $sourceFile)
    {
        $this->mappings[] = array(
            'generated_line' => $generatedLine,
            'generated_column' => $generatedColumn,
            'original_line' => $originalLine,
            'original_column' => $originalColumn,
            'source_file' => $sourceFile
        );

        $this->sources[$sourceFile] = $sourceFile;
    }

    /**
     * Saves the source map to a file
     *
     * @param string $file    The absolute path to a file
     * @param string $content The content to write
     *
     * @throws \Leafo\ScssPhp\Exception\CompilerException If the file could not be saved
     */
    public function saveMap($content)
    {
        $file = $this->options['sourceMapWriteTo'];
        $dir  = dirname($file);

        // directory does not exist
        if (! is_dir($dir)) {
            // FIXME: create the dir automatically?
            throw new CompilerException(sprintf('The directory "%s" does not exist. Cannot save the source map.', $dir));
        }

        // FIXME: proper saving, with dir write check!
        if (file_put_contents($file, $content) === false) {
            throw new CompilerException(sprintf('Cannot save the source map to "%s"', $file));
        }

        return $this->options['sourceMapURL'];
    }

    /**
     * Generates the JSON source map
     *
     * @return string
     *
     * @see https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#
     */
    public function generateJson()
    {
        $sourceMap = array();
        $mappings  = $t