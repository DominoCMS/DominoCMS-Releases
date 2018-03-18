DominoViews.registerView('Domino.Admin.Login.Form', function (data) {
    "use strict";
    return <form id="loginForm">
        <div class="loginForm">
            <div class="in">
                <component view="Domino.Admin.Login.Logo" />
                <div class="box">
                    <div class="grid-x grid-padding-x">
                        <div class="small-12 cell">
                            <label>
                                <input type="text" name="username" placeholder={data.trans.emailUsername} data-validate="required" data-validate-message={data.trans.enterUsernameEmail}/>
                            </label>
                        </div>
                    </div>
                    <div class="grid-x grid-padding-x ">
                        <div class="small-8 cell end">
                            <label>
                                <input type="password" name="password" placeholder={data.trans.password} data-validate="required" data-validate-type="password" data-validate-encrypt="sha-256" data-validate-message={data.trans.enterPassword}/>
                            </label>
                        </div>
                        <div class="small-4 cell">
                            <button type="submit" class="button expanded">
                                {data.trans.loginSubmit}
                            </button>
                        </div>
                    </div>
                    <div class="loadingHolder"></div>
                    <div class="loginFailed">{data.trans.userPasswordIncorrect}</div>

                </div>
                <div class="created">Created by Dominik Černelič</div>
            </div>
        </div>
    </form>;
});