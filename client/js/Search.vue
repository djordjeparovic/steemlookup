<template>
    <div>
        <div class="loading" v-if="loading">
            <div class="sk-fading-circle">
                <div class="sk-circle1 sk-circle"></div>
                <div class="sk-circle2 sk-circle"></div>
                <div class="sk-circle3 sk-circle"></div>
                <div class="sk-circle4 sk-circle"></div>
                <div class="sk-circle5 sk-circle"></div>
                <div class="sk-circle6 sk-circle"></div>
                <div class="sk-circle7 sk-circle"></div>
                <div class="sk-circle8 sk-circle"></div>
                <div class="sk-circle9 sk-circle"></div>
                <div class="sk-circle10 sk-circle"></div>
                <div class="sk-circle11 sk-circle"></div>
                <div class="sk-circle12 sk-circle"></div>
            </div>
        </div>
        <div class="welcome-message" v-if="noAccessCode">
          <p>
            In order to gain access to SteemLookup.com, please transfer 10 steem to steemit account:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;address: laniakea1 <br />
              &nbsp;&nbsp;&nbsp;&nbsp;memo:&nbsp;&nbsp;&nbsp; your e-mail address<br />
          </p>
          <p>
            You will then receive code that is valid for the next 30 days, and it is only valid for one IP address.
          </p>
          <p>
            Thank you for supporting the SteemLookup.com project!
          </p>
          You don't seem to have a valid access code.<br />
          For any additional questions or other paying methods please let's get in touch
          at <a href="mailto:steemlookup@gmail.com">steemlookup@gmail.com</a><br />
          <br /><br />If you already have the code paste it here<br />
          <input type="password" v-model="queryAccessCode" class="queryAccessCodeInput">
          <button class="submitAccessToken"
          @click.stop="submitAccessToken()"
          >Submit</button>
        </div>

        <div v-if="dataReady" id="layout" class="content pure-g">
            <!-- togle on nav-menu-button active class here -->
            <div id="nav" :class="['pure-u-1-3', { 'active': activeMenu }]"> 
                <a href="javascript:;" @click="toggleMenu" class="nav-menu-button pure-menu">Change your search</a>

                <div class="nav-inner">
                    <span class="red">Total results {{ totalResults }}</span>
                    <form class="pure-form" style="color: white;">
                        <fieldset>
                            <legend>Refine your search</legend>

                            <label >Author reputation</label><br />
                            <input v-on:blur="updateOnBlur()" v-model="queryAuthorReputationMin" placeholder="Min" id="input-queryAuthorReputationMin" style="width:45%;" type="number"> -
                            <input v-on:blur="updateOnBlur()" v-model="queryAuthorReputationMax" placeholder="Max" id="input-queryAuthorReputationMax" style="width:45%;" type="number"><br />

                            <label>Created before (minutes)</label><br />
                            <input v-on:blur="updateOnBlur()" v-model="queryMinutesAgoEnd" placeholder="Max" id="input-queryMinutesAgoEnd" style="width:45%;" type="number"> - 
                            <input v-on:blur="updateOnBlur()" v-model="queryMinutesAgoStart" placeholder="Min" id="input-queryMinutesAgoStart" style="width:45%;" type="number">
                            <br />
                            
                            <label>Number of words</label><br />
                            <input v-on:blur="updateOnBlur()" v-model="queryWordCountMin" placeholder="Min" id="input-queryWordCountMin" style="width:45%;" type="number"> -
                            <input v-on:blur="updateOnBlur()" v-model="queryWordCountMax" placeholder="Max" id="input-queryWordCountMax" style="width:45%;" type="number"><br />

                            <label >Number of images</label><br />
                            <input v-on:blur="updateOnBlur()" v-model="queryImageCountMin" placeholder="Min" id="input-queryImageCountMin" style="width:45%;" type="number"> -
                            <input v-on:blur="updateOnBlur()" v-model="queryImageCountMax" placeholder="Max" id="input-queryImageCountMax" style="width:45%;" type="number"><br />

                            <label>Pending payout</label><br />
                            <input v-on:blur="updateOnBlur()" v-model="queryPendingPayoutMin" placeholder="0.0" id="input-queryPendingPayoutMin" style="width:45%;" type="number" step="0.01" min="0"> -
                            <input v-on:blur="updateOnBlur()" v-model="queryPendingPayoutMax" placeholder="Max" id="input-queryPendingPayoutMax" style="width:45%;" type="number" step="0.01" max="1000"><br />

                            <label>Number of votes</label><br />
                            <input v-on:blur="updateOnBlur()" v-model="queryVoteCountMin" placeholder="Min" id="input-queryVoteCountMin" style="width:45%;" type="number"> -
                            <input v-on:blur="updateOnBlur()" v-model="queryVoteCountMax" placeholder="Max" id="input-queryVoteCountMax" style="width:45%;" type="number"><br />

                            
                            <label>Number of comments</label><br />
                            <input v-on:blur="updateOnBlur()" v-model="queryCommentCountMin" placeholder="Min" id="input-queryCommentCountMin" style="width:45%;" type="number"> -
                            <input v-on:blur="updateOnBlur()" v-model="queryCommentCountMax" placeholder="Max" id="input-queryCommentCountMax" style="width:45%;" type="number"><br />


                            <label for="input-queryTagsInclude">Include tags</label>
                            <div class="custom-radio-buttons">
                                <label for="input-tagsIncludeType-all" class="pure-radio w-45">
                                <input v-on:blur="updateOnBlur()" v-model="tagsIncludeType" id="input-tagsIncludeType-all" type="radio" value="all" class="custom-radio-flex-input" checked>
                                All of them
                                </label>

                                <label for="input-tagsIncludeType-any" class="pure-radio w-45">
                                <input v-on:blur="updateOnBlur()" v-model="tagsIncludeType" id="input-tagsIncludeType-any" type="radio" value="any" class="custom-radio-flex-input">
                                Any of them
                                </label>
                            </div>

                            <input v-on:blur="updateOnBlur()" v-model="queryTagsInclude" placeholder="Add tags to be included in the search" id="input-queryTagsInclude" type="text">

                            <label for="input-queryTagsExclude">Exclude tags</label>
                            <input v-on:blur="updateOnBlur()" v-model="queryTagsExclude" placeholder="Add tags to be excluded from the search" id="input-queryTagsExclude" type="text">
                            
                            <label for="input-queryLanguage">Select language</label>
                            <select v-model="queryLanguage" id="input-queryLanguage">
                                <option v-for="(lang, langIndex) in supportedLanguages" v-bind:key="langIndex">
                                    {{ lang }}
                                </option>
                            </select><br />

                            <input v-on:blur="updateOnBlur()" type="checkbox" id="mackbot" v-model="queryExcludeMackbot">
                            <label for="mackbot">Exclude authors from Mackbot list</label>
                            
                            <p style="font-size: small;">Looking for posts created in time range<br />
                            {{ queryMinutesAgoStartFormatted }} - {{ queryMinutesAgoEndFormatted }}</p>

                            <button v-on:click.stop="fetchData()" class="primary-button pure-button u-gray" type="button">Search</button>
                            <button v-on:click.stop="saveSearch()" class="primary-button pure-button u-gray" type="button">Save this search</button>
                        </fieldset>
                    </form>

                    <ul class="pure-menu-list">
                        <li class="pure-menu-heading">Saved searches</li>
                        <li
                        v-for="(search, searchIndex) in savedSearches" v-bind:key="searchIndex" class="pure-menu-item pure-menu-link"
                            v-on:click="restoreSearch(search.name)">
                            {{ search.name }}
                            <span class="remove-search" v-on:click="removeSearch(search.name)">X</span>
                        </li>
                    </ul>

                    <br />
                    <a href="mailto:steemlookup@gmail.com">Contact us - propose improvement or report a bug</a>
                </div>
            </div>

            <div id="list" :class="['pure-u', { 'vanish': calendarActive }]">

                <div class="email-item email-item-unread pure-g"
                v-for="(result, resultIndex) in dataReady" v-bind:key="resultIndex"
                v-on:click="updateShowArticle(resultIndex)">
                    <div class="pure-u">
                        <img width="64" height="64" :alt="`${result.author}'s avatar on Steemit.com`" class="email-avatar" :src="`https://steemitimages.com/u/${result.author}/avatar`">
                    </div>

                    <div class="pure-u-3-4">
                        <h5 class="email-name">{{ result.minutes_ago }}</h5><span :class="['post-note', {'post-note-active': activePreview === result.permlink}]">{{ activePreview === result.permlink ? 'Now showing' : 'Click to show' }}</span>
                        <h4 class="email-subject"><a target="_blank" :href="`https://steemit.com/@${result.permlink}`">{{ result.title }}</a> by <a target="_blank" :href="`https://steemit.com/@${result.author}`">{{ result.author }} ({{ result.author_reputation }})</a></h4>
                        <p class="email-desc">
                            <img class="icon-item" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxwYXRoIGQ9Ik0yNTYsMEMxMTQuNjI1LDAsMCwxMTQuNjI1LDAsMjU2czExNC42MjUsMjU2LDI1NiwyNTZjMTQxLjQwNiwwLDI1Ni0xMTQuNjI1LDI1Ni0yNTZTMzk3LjQwNiwwLDI1NiwweiBNMzI1LjgxMiwzNTQuODQ0ICAgYy0xMi41OTQsMTQuMTI1LTMwLjc4LDIyLjQzOC01NC41NjIsMjQuOTM4VjQxNmgtMzAuMzEzdi0zNi4wMzFjLTM5LjY1Ni00LjA2Mi02NC4xODgtMjcuMTI1LTczLjY1Ni02OS4xMjVsNDYuODc1LTEyLjIxOSAgIGM0LjM0NCwyNi40MDYsMTguNzE5LDM5LjU5NCw0My4xMjUsMzkuNTk0YzExLjQwNiwwLDE5Ljg0NC0yLjgxMiwyNS4yMTktOC40NjlzOC4wNjItMTIuNDY5LDguMDYyLTIwLjQ2OSAgIGMwLTguMjgxLTIuNjg4LTE0LjU2My04LjA2Mi0xOC44MTNjLTUuMzc1LTQuMjgtMTcuMzQ0LTkuNjg4LTM1Ljg3NS0xNi4yNWMtMTYuNjU2LTUuNzgtMjkuNjg4LTExLjQ2OS0zOS4wNjMtMTcuMTU1ICAgYy05LjM3NS01LjYyNS0xNy0xMy41MzEtMjIuODQ0LTIzLjY4OGMtNS44NDQtMTAuMTg4LTguNzgxLTIyLjA2My04Ljc4MS0zNS41NjNjMC0xNy43MTksNS4yNS0zMy42ODgsMTUuNjg4LTQ3Ljg3NSAgIGMxMC40MzgtMTQuMTU2LDI2Ljg3NS0yMi44MTMsNDkuMzEzLTI1Ljk2OVY5NmgzMC4zMTN2MjcuOTY5YzMzLjg3NSw0LjA2Myw1NS44MTMsMjMuMjE5LDY1Ljc4MSw1Ny41bC00MS43NSwxNy4xMjUgICBjLTguMTU2LTIzLjUtMjAuNzItMzUuMjUtMzcuNzgxLTM1LjI1Yy04LjU2MywwLTE1LjQzOCwyLjYyNS0yMC41OTQsNy44NzVjLTUuMTg4LDUuMjUtNy43ODEsMTEuNjI1LTcuNzgxLDE5LjA5NCAgIGMwLDcuNjI1LDIuNSwxMy40NjksNy41LDE3LjU2M2M0Ljk2OSw0LjA2MywxNS42ODgsOS4wOTQsMzIuMDYzLDE1LjEyNWMxOCw2LjU2MywzMi4xMjUsMTIuNzgxLDQyLjM0NCwxOC42MjUgICBjMTAuMjUsNS44NDQsMTguNDA2LDEzLjkzOCwyNC41MzEsMjQuMjE5YzYuMDk0LDEwLjMxMyw5LjE1NSwyMi4zNDUsOS4xNTUsMzYuMTI2QzM0NC43MTksMzIzLjEyNSwzMzguNDA2LDM0MC43NSwzMjUuODEyLDM1NC44NDQgICB6IiBmaWxsPSIjOTFEQzVBIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==" />
                            {{ result.pending_payout_value }}

                            &nbsp;<img class="icon-item" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUyIDUyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MiA1MjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIzMnB4IiBoZWlnaHQ9IjMycHgiPgo8Zz4KCTxwYXRoIGQ9Ik0xNCwyNC4xMzhjMy4wNzEsMCw1LjU2OS0yLjQ5OCw1LjU2OS01LjU2OEMxOS41NjksMTUuNDk4LDE3LjA3MSwxMywxNCwxM3MtNS41NjksMi40OTgtNS41NjksNS41NjkgICBDOC40MzEsMjEuNjQsMTAuOTI5LDI0LjEzOCwxNCwyNC4xMzh6IE0xNCwxNWMxLjk2OCwwLDMuNTY5LDEuNjAyLDMuNTY5LDMuNTY5UzE1Ljk2OCwyMi4xMzgsMTQsMjIuMTM4cy0zLjU2OS0xLjYwMS0zLjU2OS0zLjU2OCAgIFMxMi4wMzIsMTUsMTQsMTV6IiBmaWxsPSIjOTFEQzVBIi8+Cgk8cGF0aCBkPSJNMSwwdjQwdjEyaDUwVjQwVjBIMXogTTMsMmg0NnYyNi43MjdsLTEwLjMyNC05LjQ2NGMtMC4xOTYtMC4xNzktMC40NTQtMC4yNjgtMC43Mi0wLjI2MiAgIGMtMC4yNjUsMC4wMTItMC41MTUsMC4xMjktMC42OTQsMC4zMjVsLTkuNzk0LDEwLjcyN2wtNC43NDMtNC43NDNjLTAuMzc0LTAuMzczLTAuOTcyLTAuMzkyLTEuMzY4LTAuMDQ0TDQuNjIyLDQwSDNWMnogTTQ5LDUwSDMgICB2LThoNDZWNTB6IE03LjY0OSw0MGwxNC4zMjQtMTIuNjExbDEwLjMwMiwxMC4zMDFjMC4zOTEsMC4zOTEsMS4wMjMsMC4zOTEsMS40MTQsMHMwLjM5MS0xLjAyMywwLTEuNDE0bC00LjgwNy00LjgwN2w5LjE4MS0xMC4wNTQgICBMNDksMzEuNDRWNDBINy42NDl6IiBmaWxsPSIjOTFEQzVBIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==" />
                            {{ result.imageCount }}&nbsp;

                            &nbsp;<img class="icon-item" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCIgdmlld0JveD0iMCAwIDQ1OSA0NTkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ1OSA0NTk7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iZHJpdmUtbXMtd29yZCI+CgkJPHBhdGggZD0iTTQwOCwwSDUxQzIyLjk1LDAsMCwyMi45NSwwLDUxdjM1N2MwLDI4LjA1LDIyLjk1LDUxLDUxLDUxaDM1N2MyOC4wNSwwLDUxLTIyLjk1LDUxLTUxVjUxQzQ1OSwyMi45NSw0MzYuMDUsMCw0MDgsMHogICAgIE0zMTguNzUsMzU3SDI4MC41bC01MS0xOTEuMjVMMTc4LjUsMzU3aC0zOC4yNWwtNjEuMi0yNTVoNDMuMzVsMzguMjUsMTkxLjI1bDUxLTE5MS4yNWgzNS43bDUxLDE5MS4yNUwzMzYuNiwxMDJoNDMuMzUxICAgIEwzMTguNzUsMzU3eiIgZmlsbD0iIzkxREM1QSIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=" />
                            {{ result.wordCount }}&nbsp;

                            &nbsp;<img class="icon-item" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCIgdmlld0JveD0iMCAwIDYxMiA2MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYxMiA2MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iX3gzMl9fMjZfIj4KCQk8Zz4KCQkJPHBhdGggZD0iTTQwMS42MjUsMzI1LjEyNWgtMTkxLjI1Yy0xMC41NTcsMC0xOS4xMjUsOC41NjgtMTkuMTI1LDE5LjEyNXM4LjU2OCwxOS4xMjUsMTkuMTI1LDE5LjEyNWgxOTEuMjUgICAgIGMxMC41NTcsMCwxOS4xMjUtOC41NjgsMTkuMTI1LTE5LjEyNVM0MTIuMTgyLDMyNS4xMjUsNDAxLjYyNSwzMjUuMTI1eiBNNDM5Ljg3NSwyMTAuMzc1aC0yNjcuNzUgICAgIGMtMTAuNTU3LDAtMTkuMTI1LDguNTY4LTE5LjEyNSwxOS4xMjVzOC41NjgsMTkuMTI1LDE5LjEyNSwxOS4xMjVoMjY3Ljc1YzEwLjU1NywwLDE5LjEyNS04LjU2OCwxOS4xMjUtMTkuMTI1ICAgICBTNDUwLjQzMiwyMTAuMzc1LDQzOS44NzUsMjEwLjM3NXogTTMwNiwwQzEzNy4wMTIsMCwwLDExOS44NzUsMCwyNjcuNzVjMCw4NC41MTQsNDQuODQ4LDE1OS43NTEsMTE0Ljc1LDIwOC44MjZWNjEyICAgICBsMTM0LjA0Ny04MS4zMzljMTguNTUyLDMuMDYxLDM3LjYzOCw0LjgzOSw1Ny4yMDMsNC44MzljMTY5LjAwOCwwLDMwNi0xMTkuODc1LDMwNi0yNjcuNzVDNjEyLDExOS44NzUsNDc1LjAwOCwwLDMwNiwweiAgICAgIE0zMDYsNDk3LjI1Yy0yMi4zMzgsMC00My45MTEtMi42MDEtNjQuNjQzLTcuMDE5bC05MC4wNDEsNTQuMTIzbDEuMjA1LTg4LjcwMUM4My41LDQxNC4xMzMsMzguMjUsMzQ1LjUxMywzOC4yNSwyNjcuNzUgICAgIGMwLTEyNi43NDEsMTE5Ljg3NS0yMjkuNSwyNjcuNzUtMjI5LjVjMTQ3Ljg3NSwwLDI2Ny43NSwxMDIuNzU5LDI2Ny43NSwyMjkuNVM0NTMuODc1LDQ5Ny4yNSwzMDYsNDk3LjI1eiIgZmlsbD0iIzkxREM1QSIvPgoJCTwvZz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" />
                            {{ result.children }}

                            &nbsp;<img class="icon-item" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCIgdmlld0JveD0iMCAwIDM3OC45NCAzNzguOTQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDM3OC45NCAzNzguOTQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBkPSJNMzQ4LjE1MSw1NC41MTRjLTE5Ljg4My0xOS44ODQtNDYuMzE1LTMwLjgyNi03NC40MzUtMzAuODI2Yy0yOC4xMjQsMC01NC41NTksMTAuOTQyLTc0LjQ0OSwzMC44MjZsLTkuNzk4LDkuOGwtOS43OTgtOS44ICAgYy0xOS44ODQtMTkuODg0LTQ2LjMyNS0zMC44MjYtNzQuNDQzLTMwLjgyNmMtMjguMTE3LDAtNTQuNTYsMTAuOTQyLTc0LjQ0MiwzMC44MjZjLTQxLjA0OSw0MS4wNTMtNDEuMDQ5LDEwNy44NDgsMCwxNDguODg1ICAgbDE0Ny4wOSwxNDcuMDkxYzIuNDA1LDIuNDE0LDUuMzk5LDMuODkyLDguNTI3LDQuNDYxYzEuMDQ5LDAuMjA3LDIuMTA0LDAuMzAzLDMuMTYxLDAuMzAzYzQuMTYxLDAsOC4zMjktMS41ODcsMTEuNDk4LTQuNzY0ICAgbDE0Ny4wOS0xNDcuMDkxQzM4OS4yMDMsMTYyLjM2MiwzODkuMjAzLDk1LjU2NywzNDguMTUxLDU0LjUxNHogTTMyNS4xNTUsMTgwLjQwNEwxODkuNDcsMzE2LjA5MUw1My43ODIsMTgwLjQwNCAgIGMtMjguMzY4LTI4LjM2NC0yOC4zNjgtNzQuNTE0LDAtMTAyLjg5M2MxMy43NDEtMTMuNzM5LDMyLjAxNy0yMS4yOTYsNTEuNDQ2LTIxLjI5NmMxOS40MzEsMCwzNy43MDIsNy41NTcsNTEuNDM4LDIxLjI5NiAgIGwyMS4zMDUsMjEuMzEyYzYuMTA3LDYuMDk4LDE2Ljg5Nyw2LjA5OCwyMy4wMDMsMGwyMS4yOTctMjEuMzEyYzEzLjczNy0xMy43MzksMzIuMDA5LTIxLjI5Niw1MS40NDYtMjEuMjk2ICAgYzE5LjQzMSwwLDM3LjcwMSw3LjU1Nyw1MS40MzgsMjEuMjk2QzM1My41MjYsMTA1Ljg5LDM1My41MjYsMTUyLjAzOSwzMjUuMTU1LDE4MC40MDR6IiBmaWxsPSIjOTFEQzVBIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==" />
                            {{ result.net_votes }}

                            <br><img class="icon-item" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ4Ni45ODIgNDg2Ljk4MiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDg2Ljk4MiA0ODYuOTgyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCI+CjxnPgoJPHBhdGggZD0iTTEzMS4zNSw0MjIuOTY5YzE0LjYsMTQuNiwzOC4zLDE0LjYsNTIuOSwwbDE4MS4xLTE4MS4xYzUuMi01LjIsOS4yLTExLjQsMTEuOC0xOGMxOC4yLDUuMSwzNS45LDcuOCw1MS41LDcuNyAgIGMzOC42LTAuMiw1MS40LTE3LjEsNTUuNi0yNy4yYzQuMi0xMCw3LjItMzEtMTkuOS01OC42Yy0wLjMtMC4zLTAuNi0wLjYtMC45LTAuOWMtMTYuOC0xNi44LTQxLjItMzIuMy02OC45LTQzLjggICBjLTUuMS0yLjEtMTAuMi00LTE1LjItNS44di0wLjNjLTAuMy0yMi4yLTE4LjItNDAuMS00MC40LTQwLjRsLTEwOC41LTEuNWMtMTQuNC0wLjItMjguMiw1LjQtMzguMywxNS42bC0xODEuMiwxODEuMSAgIGMtMTQuNiwxNC42LTE0LjYsMzguMywwLDUyLjlMMTMxLjM1LDQyMi45Njl6IE0yNzAuOTUsMTE3Ljg2OWMxMi4xLTEyLjEsMzEuNy0xMi4xLDQzLjgsMGM3LjIsNy4yLDEwLjEsMTcuMSw4LjcsMjYuNCAgIGMxMS45LDguNCwyNi4xLDE2LjIsNDEuMywyMi41YzUuNCwyLjIsMTAuNiw0LjIsMTUuNiw1LjlsLTAuNi00My42YzAuOSwwLjQsMS43LDAuNywyLjYsMS4xYzIzLjcsOS45LDQ1LDIzLjMsNTguNywzNyAgIGMwLjIsMC4yLDAuNCwwLjQsMC42LDAuNmMxMywxMy4zLDE0LjQsMjEuOCwxMy4zLDI0LjRjLTMuNCw4LjEtMzkuOSwxNS4zLTk1LjMtNy44Yy0xNi4yLTYuOC0zMS40LTE1LjItNDMuNy0yNC4zICAgYy0wLjQsMC41LTAuOSwxLTEuMywxLjVjLTEyLjEsMTIuMS0zMS43LDEyLjEtNDMuOCwwQzI1OC44NSwxNDkuNTY5LDI1OC44NSwxMjkuOTY5LDI3MC45NSwxMTcuODY5eiIgZmlsbD0iIzkxREM1QSIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=" />
                            {{ result.tags.join(', ') }}


                        </p>
                    </div>
                </div>


            </div>

            <div id="main" class="pure-u" @click="scrollTopList">
                <div class="email-content">
                    <div class="error" v-if="error">
                      {{ error.message }} Let us know <a href="mailto:steemlookup@gmail.com">on our email</a>
                  </div>
                    <div class="email-content-header pure-g">
                        <div class="pure-u-3-4">
                            <h1 class="email-content-title">{{ showArticle.title }}</h1>
                            <p class="email-content-subtitle">
                                Created by <a target="_blank" :href="`https://steemit.com/@${showArticle.author}`">{{ showArticle.author }}</a><br />at <span>{{ showArticle.created }}</span>
                            </p>
                        </div>

                        <div class="email-content-controls pure-u-1-4">
                            <a target="_blank" :href="`https://steemit.com/@${showArticle.permlink}`" class="secondary-button pure-button">Open</a>
                        </div>
                    </div>

                    <div class="email-content-body">                        
                        <p style="font-size: small; margin: 0;">Preview can be hardly readable sometimes, because we are still in beta. Click to focus.</p>
                        <!-- <div v-html="showArticle.body"></div> -->
                        <div id="showArticle"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import cloneDeep from "lodash.clonedeep";
const supportedLanguages = require("./supportedLanguages.js");
const getAccessCode = () => {
  try {
    return localStorage.getItem("queryAccessCode");
  } catch (e) {
    console.log("getAccessCode error", e);
  }
};

const setAccessCode = access_code => {
  try {
    localStorage.setItem("queryAccessCode", access_code);
  } catch (e) {
    console.log("setAccessCode error", e);
  }
};

export default {
  /** The name of the application. */
  name: "Search",
  data() {
    return {
      noAccessCode: false,
      loading: false,
      supportedLanguages: supportedLanguages(),
      activeMenu: "",
      calendarActive:
        document.querySelectorAll(".vdatetime-overlay").length === 1,
      activePreview: null,
      dataReady: null,
      totalResults: 0,
      error: null,
      page: 1,
      showArticle: {},
      savedSearches: [],
      //minutesSlider: [0, 1440],
      // query
      queryTagsInclude: "",
      queryTagsExclude: "",
      queryAuthorReputationMin: "",
      queryAuthorReputationMax: "",
      queryImageCountMin: "",
      queryImageCountMax: "",
      queryWordCountMin: "",
      queryWordCountMax: "",
      queryWordCountMax: "",
      queryCommentCountMin: "",
      queryCommentCountMax: "",
      queryVoteCountMin: "",
      queryVoteCountMax: "",
      queryPendingPayoutMin: "",
      queryPendingPayoutMax: "",
      //   queryStartDate: "",
      //   queryEndDate: "",
      tagsIncludeType: "any",
      queryMinutesAgoStart: 1440, // now - 24h
      queryMinutesAgoEnd: 0, // now
      queryLanguage: "",
      queryExcludeMackbot: false,
      queryMinutesAgoStartFormatted: "",
      queryMinutesAgoEndFormatted: "",
      queryAccessCode: "johnnyb"
    };
  },
  created() {
    this.queryAccessCode = getAccessCode() || "johnnyb";
    // fetch the data when the view is created and the data is already being observed
    this.fetchData();
    setInterval(() => {
      if (
        document.getElementById("list") &&
        document.getElementById("list").scrollTop < 10
      ) {
        this.fetchData({ noLoading: true });
      }
    }, 30 * 1000);

    try {
      let savedSearches =
        JSON.parse(localStorage.getItem("SL-saved-searches")) || [];
      this.savedSearches = savedSearches;
    } catch (e) {
      console.warn("cant load saved searches");
    }
  },

  updated() {
    try {
      this.queryMinutesAgoStartFormatted = Date.parse("now")
        .add({ minutes: -this.queryMinutesAgoStart })
        .toString("MMM d yyyy HH:mm");
      this.queryMinutesAgoEndFormatted = Date.parse("now")
        .add({ minutes: -this.queryMinutesAgoEnd })
        .toString("MMM d yyyy HH:mm");
    } catch (e) {
      window.steem_lookup_errors.push("cant update time range");
    }
  },
  watch: {
    $route: "fetchData" // call again the method if the route changes
  },
  methods: {
    submitAccessToken() {
      setAccessCode(this.queryAccessCode);
      this.fetchData();
    },

    updateOnBlur() {
      this.fetchData();
    },
    fetchData(params = {}) {
      this.$nextTick(() => {
        if (!params.noLoading) {
          this.loading = true;
        }

        const qparams = [
          "page",
          "queryTagsInclude",
          "queryTagsExclude",
          "queryAuthorReputationMin",
          "queryAuthorReputationMax",
          "queryImageCountMin",
          "queryImageCountMax",
          "queryWordCountMin",
          "queryWordCountMax",
          "queryCommentCountMin",
          "queryCommentCountMax",
          "queryVoteCountMin",
          "queryVoteCountMax",
          "queryPendingPayoutMin",
          "queryPendingPayoutMax",
          "tagsIncludeType",
          "queryMinutesAgoStart",
          "queryMinutesAgoEnd",
          "queryLanguage",
          "queryExcludeMackbot",
          "queryAccessCode"
        ];
        const apiParams = {};
        qparams.forEach(param => {
          apiParams[param] = this[param];
        });

        apiParams.queryMinutesAgoStart = apiParams.queryMinutesAgoStart || 1440;
        apiParams.queryMinutesAgoEnd = apiParams.queryMinutesAgoEnd || 0;

        axios
          .post(`/query`, Object.assign({}, apiParams))
          .then(response => {
            this.loading = false;
            if (response.data.totalResults > 0) {
              this.noAccessCode = false;
              this.dataReady = response.data.results;
              this.totalResults = response.data.totalResults;
              if (!params.noLoading) {
                this.showArticle = response.data.results[0];
                this.activePreview = this.showArticle.permlink;
                this.updateShowArticle(0);
              }
              this.error = null;
            } else if (response.data.error === "ACCESS_DENIED") {
              this.noAccessCode = true;
            } else {
              this.dataReady = [
                {
                  author: "",
                  author_reputation: 0,
                  children: 0,
                  created: "",
                  imageCount: 0,
                  minutes_ago: "now",
                  net_votes: 0,
                  pending_payout_value: 0,
                  permlink: "",
                  tags: [""],
                  title: "No results found matching your search criteria",
                  wordCount: 0
                }
              ];
              // this.error = { message: "No data matches your criteria" };
            }
          })
          .catch(e => {
            console.warn("cant load query data");
            this.loading = false;
            this.error = e;
          });
      });
    },
    saveSearch() {
      try {
        let searchName = prompt(
          "Please enter name for this search",
          "The first saved search"
        );
        searchName = searchName || "The first saved search";
        let obj2Save = {
          name: searchName
        };

        Object.keys(this)
          .filter(k => k.indexOf("query") === 0)
          .forEach(k => {
            obj2Save[k] = this[k];
          });
        let savedSearches =
          JSON.parse(localStorage.getItem("SL-saved-searches")) || [];
        savedSearches.push(obj2Save);
        this.savedSearches = savedSearches;
        localStorage.setItem(
          "SL-saved-searches",
          JSON.stringify(this.savedSearches)
        );
      } catch (e) {
        this.error = { message: "Cant save this search" };
      }
    },
    restoreSearch(name) {
      try {
        let savedSearches =
          JSON.parse(localStorage.getItem("SL-saved-searches")) || [];
        let targetSearch = savedSearches.filter(s => s.name === name)[0];
        if (targetSearch) {
          Object.keys(targetSearch)
            .filter(k => k.indexOf("query") === 0)
            .forEach(k => {
              this[k] = targetSearch[k];
            });
        }
      } catch (e) {
        this.error = { message: "Cant restore this search" };
      }
    },
    removeSearch(name) {
      try {
        let savedSearches =
          JSON.parse(localStorage.getItem("SL-saved-searches")) || [];
        this.savedSearches = savedSearches.filter(s => s.name != name);
        localStorage.setItem(
          "SL-saved-searches",
          JSON.stringify(this.savedSearches)
        );
      } catch (e) {
        this.error = { message: "Cant remove this search" };
      }
    },
    updateShowArticle(index) {
      this.showArticle = JSON.parse(JSON.stringify(this.dataReady[index]));
      this.showArticle.created = new Date(this.showArticle.created).toString(
        "MMM d yyyy HH:mm:ss"
      );
      this.showArticle.body = "...";
      axios
        .post(`/query-post`, this.showArticle)
        .then(responsePost => {
          // this.showArticle = responsePost.data;
          document.getElementById("showArticle").innerHTML =
            responsePost.data.body;
        })
        .catch(e => {
          console.warn("cant load post data", e);
        });

      this.activePreview = this.dataReady[index].permlink;
    },
    toggleMenu() {
      this.activeMenu = this.activeMenu ? "" : "active";
    },
    closeX() {
      this.error = null;
      location.reload();
    },
    verifyActiveStates() {
      this.calendarActive =
        document.querySelectorAll(".vdatetime-overlay").length === 1;
      // this.updateDataFromSlider();
    },
    scrollTopList() {
      try {
        if (
          document.querySelector(".post-note-active").offsetTop >
          window.innerHeight - 150
        ) {
          document.getElementById("list").scrollTop =
            document.querySelector(".post-note-active").offsetTop - 50;
        }
      } catch (e) {
        window.steem_lookup_errors.push(
          `document.querySelector('.post-note-active').offsetTop; not defined`
        );
      }
    }
    // updateDataFromSlider() {
    //   try {
    //     this.queryMinutesAgoStart = this.minutesSlider[1];
    //     this.queryMinutesAgoEnd = this.minutesSlider[0];
    //     this.queryMinutesAgoStartFormatted = Date.parse("now")
    //       .add({ minutes: -this.queryMinutesAgoStart })
    //       .toString("MMM d yyyy HH:mm");
    //     this.queryMinutesAgoEndFormatted = Date.parse("now")
    //       .add({ minutes: -this.queryMinutesAgoEnd })
    //       .toString("MMM d yyyy HH:mm");
    //   } catch (e) {
    //     window.steem_lookup_errors.push("cant update slider range");
    //   }
    // }
  },

  /** Fires when the app has been mounted. */
  mounted() {
    // If the user is authenticated, fetch the data from the API
    setInterval(this.verifyActiveStates, 1000);
  }
};
</script>
