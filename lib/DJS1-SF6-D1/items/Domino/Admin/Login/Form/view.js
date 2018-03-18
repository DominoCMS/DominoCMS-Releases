DominoViews.registerView('Domino.Admin.Login.Form', function (data) {
    "use strict";
    return {tag: "form", attrs: {id:"loginForm"}, children: [
        {tag: "div", attrs: {}, className:"loginForm", children: [
            {tag: "div", attrs: {}, className:"in", children: [
                br("component", {view:"Domino.Admin.Login.Logo"}), 
                {tag: "div", attrs: {}, className:"box", children: [
                    {tag: "div", attrs: {}, className:"grid-x grid-padding-x", children: [
                        {tag: "div", attrs: {}, className:"small-12 cell", children: [
                            {tag: "label", attrs: {}, children: [
                                {tag: "input", attrs: {type:"text",name:"username",placeholder:data.trans.emailUsername,"data-validate":"required","data-validate-message":data.trans.enterUsernameEmail}}
                            ]}
                        ]}
                    ]}, 
                    {tag: "div", attrs: {}, className:"grid-x grid-padding-x ", children: [
                        {tag: "div", attrs: {}, className:"small-8 cell end", children: [
                            {tag: "label", attrs: {}, children: [
                                {tag: "input", attrs: {type:"password",name:"password",placeholder:data.trans.password,"data-validate":"required","data-validate-type":"password","data-validate-encrypt":"sha-256","data-validate-message":data.trans.enterPassword}}
                            ]}
                        ]}, 
                        {tag: "div", attrs: {}, className:"small-4 cell", children: [
                            {tag: "button", attrs: {type:"submit"}, className:"button expanded", children: [
                                data.trans.loginSubmit
                            ]}
                        ]}
                    ]}, 
                    {tag: "div", attrs: {}, className:"loadingHolder"}, 
                    {tag: "div", attrs: {}, className:"loginFailed", children: [data.trans.userPasswordIncorrect]}

                ]}, 
                {tag: "div", attrs: {}, className:"created", children: ["Created by Dominik Černelič"]}
            ]}
        ]}
    ]};
});
