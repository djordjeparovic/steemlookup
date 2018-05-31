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

        <div v-if="dataReady" id="layout" class="content pure-g">
            <!-- togle on nav-menu-button active class here -->
            <div id="nav" :class="['pure-u-1-3', { 'active': activeMenu, 'nav-collapsed': filterMenuCollapsed}]"> 
                <img v-show="!filterMenuCollapsed" class="curie-logo" src="//steemit-production-imageproxy-upload.s3.amazonaws.com/DQmTWefzaDLymyuVQ2ZqEzpcZTbs6BvorjmLZfqJYm3RWPg">
                <a href="javascript:;" @click="toggleMenu" class="nav-menu-button pure-menu">Change your search</a>
                <button
                  class="primary-button pure-button collapse-btn"
                  @click="toggleCollapseFilter">
                    <div style="display: block; marign: 0 auto;" class="collapse-btn-child">
                      <span v-show="!filterMenuCollapsed">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24" height="24"><defs><clipPath id="_clipPath_v1XZEi6sRMReNRt4JmibeQUvbDA9kH7c"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#_clipPath_v1XZEi6sRMReNRt4JmibeQUvbDA9kH7c)"><path d=" M 11 5 L 4 12 L 11 19" fill-rule="evenodd" fill="none" vector-effect="non-scaling-stroke" stroke-width="2" stroke="rgb(255,255,255)" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4"/></g></svg>
                      </span>
                      <span v-show="filterMenuCollapsed">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24" height="24"><defs><clipPath id="_clipPath_3MTA8wqwPkVSN5h1q6XiXxvpxaNsJ52i"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#_clipPath_3MTA8wqwPkVSN5h1q6XiXxvpxaNsJ52i)"><clipPath id="_clipPath_FFqARoG3YpBUCeh1ceqwiyB0wzN6ZyUD"><rect x="0" y="0" width="24" height="24" transform="matrix(1,0,0,1,0,0)" fill="rgb(255,255,255)"/></clipPath><g clip-path="url(#_clipPath_FFqARoG3YpBUCeh1ceqwiyB0wzN6ZyUD)"><g id="Group"><path d=" M 4 5 L 11 12 L 4 19" fill-rule="evenodd" fill="none" vector-effect="non-scaling-stroke" stroke-width="2" stroke="rgb(255,255,255)" stroke-opacity="100" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4"/></g></g></g></svg>
                      </span>
                    </div>
                </button>

                <div class="nav-inner" v-show="!filterMenuCollapsed">
                    <span class="red total-results">Total results {{ (totalResults || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}</span>
                    <form @submit.prevent
                      class="pure-form"
                      style="color: white;">
                        <fieldset>
                            <legend id="refine-your-search">Refine your search</legend>

                            <label for="numOfPosts">Load up to</label>
                            <select style="width: 80px;" v-model="queryNumOfPostsToShow"
                              @change="updateOnBlur"
                              name="numOfPostss"
                              id="numOfPosts">
                              <option value="1000">1000</option>
                              <option value="2000" selected>2000</option>
                              <option value="5000">5000</option>
                              <option value="10000">10000</option>
                              <option value="20000">20000</option>
                              <option value="50000">50000</option>
                            </select>&nbsp;<span style="color: #bdb9b9;">posts</span>
                            <br>
                            <label for="externalFe">External linking</label>
                            <select style="width: 180px;" v-model="externalFe"
                              name="externalFe"
                              id="externalFe">
                              <option value="steemit.com" selected>steemit.com</option>
                              <option value="busy.org">busy.org</option>
                              <option value="steemitstage.com">steemitstage.com</option>
                              <option value="steemdb.com">steemdb.com</option>
                            </select><br>
                            <br>
                            <label for="sortBy">Sort by:</label>
                            <select
                              v-model="querySort"
                              @change="updateOnBlur"
                              name="sortBy"
                              id="sortby"
                              style="width:95%;">
                                <option value="created-DESC">Time created - DESC</option>
                                <option value="created-ASC">Time created - ASC</option>
                                <option value="author_reputation-DESC">Author reputation - DESC</option>
                                <option value="author_reputation-ASC">Author reputation - ASC</option>
                                <option value="pending_payout_value-DESC">Pending payout value - DESC</option>
                                <option value="pending_payout_value-ASC">Pending payout value - ASC</option>
                                <option value="children-DESC"># of comments - DESC</option>
                                <option value="children-ASC"># of comments - ASC</option>
                                <option value="net_votes-DESC"># of upvotes - DESC</option>
                                <option value="net_votes-ASC"># of upvotes - ASC</option>
                                <option value="imagecount-DESC"># of images - DESC</option>
                                <option value="imagecount-ASC"># of images - ASC</option>
                                <option value="wordcount-DESC"># of words - DESC</option>
                                <option value="wordcount-ASC"># of words - ASC</option>
                            </select>

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

                            <label>User Steem Power</label><br />
                            <input v-on:blur="updateOnBlur()" v-model="querySteemPowerMin" placeholder="Min" id="input-querySteemPowerMin" style="width:45%;" type="number"> -
                            <input v-on:blur="updateOnBlur()" v-model="querySteemPowerMax" placeholder="Max" id="input-querySteemPowerMax" style="width:45%;" type="number"><br />

                            <label>Number of votes</label><br />
                            <input v-on:blur="updateOnBlur()" v-model="queryVoteCountMin" placeholder="Min" id="input-queryVoteCountMin" style="width:45%;" type="number"> -
                            <input v-on:blur="updateOnBlur()" v-model="queryVoteCountMax" placeholder="Max" id="input-queryVoteCountMax" style="width:45%;" type="number"><br />

                            
                            <label>Number of comments</label><br />
                            <input v-on:blur="updateOnBlur()" v-model="queryCommentCountMin" placeholder="Min" id="input-queryCommentCountMin" style="width:45%;" type="number"> -
                            <input v-on:blur="updateOnBlur()" v-model="queryCommentCountMax" placeholder="Max" id="input-queryCommentCountMax" style="width:45%;" type="number"><br />


                            <label for="input-queryTagsInclude">Include tags</label>
                            <select
                              v-model="tagsIncludeType"
                              @change="updateOnBlur"
                              name="input-queryTagsInclude"
                              id="input-queryTagsInclude">
                                <option value="all">All of them</option>
                                <option value="any">Any of them</option>
                            </select>
                            <br>
                            <input v-on:blur="updateOnBlur()" v-model="queryTagsInclude" placeholder="Add tags to be included in the search" id="input-queryTagsInclude" type="text">

                            <label for="input-queryTagsExclude">Exclude tags</label>
                            <select
                              v-model="tagsExcludeType"
                              @change="updateOnBlur"
                              name="input-queryTagsExclude"
                              id="input-queryTagsExclude">
                                <option value="all">All of them</option>
                                <option value="any">Any of them</option>
                            </select>
                            <br>
                            <input v-on:blur="updateOnBlur()" v-model="queryTagsExclude" placeholder="Add tags to be excluded from the search" id="input-queryTagsExclude" type="text">
                            
                            <label for="input-queryTitleContains">Title contains</label>
                            <input v-on:blur="updateOnBlur()"
                              v-model="queryTitleContains"
                              placeholder="Title should contain words"
                              id="input-queryTitleContains"
                              type="text">

                            <label for="input-queryBodyContains">Body contains</label>
                            <input v-on:blur="updateOnBlur()"
                              v-model="queryBodyContains"
                              placeholder="Body should contain words"
                              id="input-queryBodyContains"
                              type="text">

                            <label for="input-queryTitleNotContains">Title doesn't contain</label>
                            <input v-on:blur="updateOnBlur()"
                              v-model="queryTitleNotContains"
                              placeholder="Title doesn't contain words"
                              id="input-queryTitleNotContains"
                              type="text">

                            <label for="input-queryBodyNotContains">Body doesn't contain</label>
                            <input v-on:blur="updateOnBlur()"
                              v-model="queryBodyNotContains" 
                              placeholder="Body doesn't contain words" 
                              id="input-queryBodyNotContains" 
                              type="text">

                            <label for="input-queryLanguage">Select language</label>
                            <select v-model="queryLanguage" id="input-queryLanguage">
                                <option v-for="(lang, langIndex) in supportedLanguages" v-bind:key="langIndex">
                                    {{ lang }}
                                </option>
                            </select><br />

                            <input
                              @blur="updateOnBlur()"
                              type="checkbox" id="mackbot" v-model="queryExcludeMackbot">
                            <label for="mackbot">Exclude Mackbot list</label>
                            
                            <button
                              type="button"
                              class="primary-button pure-button u-gray"
                              @click.stop="openMyMackbotListModal">
                              Edit custom exclude list
                            </button><br>
                            <input v-on:blur="updateOnBlur()" type="checkbox" id="myMackbot" v-model="queryExcludeMyMackbot">
                            <label for="myMackbot">Exclude custom list</label>

                            <br>
                            <input type="checkbox" id="nightMode" v-model="nightMode" value="true">
                            <label for="nightMode">Night mode</label>

                            <p style="font-size: small;">Looking for posts created in time range<br />
                            {{ queryMinutesAgoStartFormatted }} - {{ queryMinutesAgoEndFormatted }}</p>

                            <button v-on:click.stop="fetchData()" class="primary-button pure-button u-gray search-btn" type="button">Search</button><br>
                            <button v-on:click.stop="showSaveSearchModal = true" class="primary-button pure-button u-gray search-btn save-btn" type="button">Save new</button>
                            <button v-on:click.stop="showUpdateSearchModal = true" class="primary-button pure-button u-gray search-btn save-btn" type="button">Save as</button>
                        </fieldset>
                    </form>

                    <ul class="pure-menu-list">
                        <li class="pure-menu-heading">Saved searches</li>
                        <li
                          v-for="(search, searchIndex) in savedSearches"
                          :key="searchIndex"
                          @click="restoreSearch(search.name)"
                          class="pure-menu-item pure-menu-link">
                            <span class="restore-search pointer">{{ search.name }}</span>
                            <span class="remove-search pointer" @click="removeSearch(search.name)">X</span>
                        </li>
                    </ul>

                    <br />
                </div>
            </div>

            <virtual-list id="list"
              :class="['pure-u',
                {'list-collapsed': filterMenuCollapsed,
                  'preview-collapsed-list': previewCollapsed,
                  'filter-and-preview-collapsed-list': previewCollapsed && filterMenuCollapsed
                }
              ]"
              :size="virtualListItemSize"
              :remain="10"
              :bench="30"
              :start="lastSelectedPostIndex">
                <item
                  class="email-item email-item-unread pure-g"
                  style="box-sizing: border-box;"
                  v-for="(result, resultIndex) in dataReady"
                  :key="resultIndex"
                  @click="updateShowArticle(resultIndex)">
                    <div class="pure-u">
                      <div class="pure-g">
                        <img width="64" height="64"
                          alt="Post thumbnail"
                          :class="['email-avatar-hv', {'email-avatar': !previewCollapsed, 'avatar-1-collapsed': previewCollapsed}]"
                          :src="result.thumbnails[0]">
                      </div>
                      <div class="pure-g">
                        <img v-if="result.thumbnails[1]"
                          :class="{'email-avatar-2': !previewCollapsed, 'avatar-2-collapsed': previewCollapsed}"
                          :src="result.thumbnails[1]" 
                          alt="Post thumbnail">
                      </div>
                    </div>

                    <div class="pure-u-3-4">
                        <h5 class="email-name">{{ result.minutes_ago }}</h5><span :class="['post-note', {'post-note-active': activePreview === result.permlink, 'post-note-collapsed': filterMenuCollapsed, 'post-note-active-collapsed': filterMenuCollapsed && (activePreview === result.permlink), 'note-hidden': previewCollapsed }]">{{ activePreview === result.permlink ? 'Now showing' : 'Click to show' }}</span>
                        <h4 class="email-subject"><a target="_blank" :href="`https://${externalFe}${externalFe === 'steemdb.com' ? '/steemit' : ''}/@${result.permlink}`">{{ result.title }}</a> by <a target="_blank" :href="`https://${externalFe}/@${result.author}`">{{ result.author }} ({{ result.author_reputation }})</a></h4>
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

                            &nbsp;<img class="icon-item" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0NjMgNDYzIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0NjMgNDYzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPHBhdGggZD0iTTM1Mi4yNzYsNjIuNzYzbDI5LjcyLTUxLjUxNWMxLjMzOS0yLjMyLDEuMzM4LTUuMTgtMC4wMDItNy40OTlDMzgwLjY1NCwxLjQyOSwzNzguMTc5LDAsMzc1LjUsMGgtMTQ0ICBjLTMuMDY2LDAtNS44MjQsMS44NjctNi45NjQsNC43MTVsLTcuOTMsMTkuODI1QzEwOC4zMTEsMzIuMjE1LDI0LDEyMi40MjQsMjQsMjMxLjVjMCw4MC4wNTksNDUuOTE5LDE1Mi42MjcsMTE3LjY2LDE4Ny4wOTMgIGwtMTMuMTYsMzQuMjE1Yy0xLjMxNywzLjQyNiwwLjAzNyw3LjMwMiwzLjIwMiw5LjE2YzEuMTg3LDAuNjk2LDIuNDk2LDEuMDMyLDMuNzk0LDEuMDMyYzIuMTY1LDAsNC4yOTctMC45MzYsNS43NjYtMi42OTggIGwyNi4xNi0zMS4zOTNDMTg4LjA1Niw0MzUuNjAzLDIwOS41OTQsNDM5LDIzMS41LDQzOUMzNDUuOTE2LDQzOSw0MzksMzQ1LjkxNiw0MzksMjMxLjUgIEM0MzksMTY0LjM5Nyw0MDYuNjg2LDEwMS43NTgsMzUyLjI3Niw2Mi43NjN6IE0zNDIuMjkyLDIxMi4zMThjLTEuMjM0LTIuNjM1LTMuODgyLTQuMzE4LTYuNzkyLTQuMzE4aC02Ny4wMTVsNjAuMTUtMTA0LjI2ICBDMzY4LjQyNCwxMzQuMDQ0LDM5MiwxODEuMzE1LDM5MiwyMzEuNUMzOTIsMzIwLDMyMCwzOTIsMjMxLjUsMzkyYy0xMC4zOTMsMC0yMC43My0wLjk5OS0zMC44NDgtMi45NjZsMTQwLjYxLTE2OC43MzIgIEMzNDMuMTI1LDIxOC4wNjUsMzQzLjUyNiwyMTQuOTU0LDM0Mi4yOTIsMjEyLjMxOHogTTIzNi41NzgsMTVoMTI1LjkzN0wyNDkuMDA0LDIxMS43NTJjLTEuMzM5LDIuMzItMS4zMzgsNS4xOCwwLjAwMiw3LjQ5OSAgYzEuMzQsMi4zMiwzLjgxNSwzLjc0OSw2LjQ5NCwzLjc0OWg2My45ODdMMTU5LjQ4OCw0MTQuOTk4Yy0wLjAwMy0wLjI3OC0wLjAyMy0wLjU1NC0wLjA1Ny0wLjgyOEwyMjIuNSwyNTAuMTkyICBjMC44ODctMi4zMDcsMC41ODEtNC45MDEtMC44MTctNi45MzhjLTEuMzk5LTIuMDM3LTMuNzEyLTMuMjU0LTYuMTgzLTMuMjU0aC02OC45MjJMMjM2LjU3OCwxNXogTTEyOS4yODksMjUxLjcwNSAgYzEuMzk2LDIuMDYxLDMuNzIzLDMuMjk1LDYuMjExLDMuMjk1aDY5LjA4bC00NS45NjcsMTE5LjUxMkMxMDUuMTU3LDM0Ny4yMTksNzEsMjkxLjg5MSw3MSwyMzEuNSAgYzAtMzguNTI2LDEzLjg1NC03NS43NzYsMzkuMDEtMTA0Ljg4N2MyMi42MjktMjYuMTg3LDUzLjAzOC00NC4zMjQsODYuNDc5LTUxLjc3OWwtNjcuOTUyLDE2OS44ODEgIEMxMjcuNjEyLDI0Ny4wMjUsMTI3Ljg5NSwyNDkuNjQ0LDEyOS4yODksMjUxLjcwNXogTTM5LDIzMS41YzAtOTguNzIzLDc0LjQ0MS0xODAuNzg3LDE3MS4zNi0xOTEuMzQ0bC03LjI1NiwxOC4xNCAgYy00MC40NDQsNi41ODYtNzcuNDk1LDI3LjMyNC0xMDQuNDQzLDU4LjUwOUM3MS4xNSwxNDguNjQxLDU2LDE4OS4zNzMsNTYsMjMxLjVjMCw2Ni41NjMsMzcuOTM3LDEyNy41MTksOTcuMTk0LDE1Ny4xMDIgIGwtNi4xMjksMTUuOTM2QzgxLjEzNywzNzIuMzUyLDM5LDMwNS4zNjUsMzksMjMxLjV6IE0yMzEuNSw0MjRjLTE4LjI5MSwwLTM2LjI5OS0yLjU1NS01My42NjUtNy41ODdsMTIuMDEtMTQuNDExICBjMTMuNTcsMy4zMDMsMjcuNTY2LDQuOTk4LDQxLjY1NSw0Ljk5OGM5Ni43NzEsMCwxNzUuNS03OC43MjksMTc1LjUtMTc1LjVjMC01NS41MTgtMjYuMzczLTEwNy43ODQtNzAuODA2LTE0MC44NjJsOC41NDUtMTQuODEyICBDMzk0LjQ5MywxMTIuMDYzLDQyNCwxNjkuNzQzLDQyNCwyMzEuNUM0MjQsMzM3LjY0NSwzMzcuNjQ1LDQyNCwyMzEuNSw0MjR6IiBmaWxsPSIjOTFEQzVBIiAvPgo8Zz4KPC9nPgo8L3N2Zz4KCg==" />
                            {{ result.steem_power }}

                            <br><img class="icon-item" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ4Ni45ODIgNDg2Ljk4MiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDg2Ljk4MiA0ODYuOTgyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCI+CjxnPgoJPHBhdGggZD0iTTEzMS4zNSw0MjIuOTY5YzE0LjYsMTQuNiwzOC4zLDE0LjYsNTIuOSwwbDE4MS4xLTE4MS4xYzUuMi01LjIsOS4yLTExLjQsMTEuOC0xOGMxOC4yLDUuMSwzNS45LDcuOCw1MS41LDcuNyAgIGMzOC42LTAuMiw1MS40LTE3LjEsNTUuNi0yNy4yYzQuMi0xMCw3LjItMzEtMTkuOS01OC42Yy0wLjMtMC4zLTAuNi0wLjYtMC45LTAuOWMtMTYuOC0xNi44LTQxLjItMzIuMy02OC45LTQzLjggICBjLTUuMS0yLjEtMTAuMi00LTE1LjItNS44di0wLjNjLTAuMy0yMi4yLTE4LjItNDAuMS00MC40LTQwLjRsLTEwOC41LTEuNWMtMTQuNC0wLjItMjguMiw1LjQtMzguMywxNS42bC0xODEuMiwxODEuMSAgIGMtMTQuNiwxNC42LTE0LjYsMzguMywwLDUyLjlMMTMxLjM1LDQyMi45Njl6IE0yNzAuOTUsMTE3Ljg2OWMxMi4xLTEyLjEsMzEuNy0xMi4xLDQzLjgsMGM3LjIsNy4yLDEwLjEsMTcuMSw4LjcsMjYuNCAgIGMxMS45LDguNCwyNi4xLDE2LjIsNDEuMywyMi41YzUuNCwyLjIsMTAuNiw0LjIsMTUuNiw1LjlsLTAuNi00My42YzAuOSwwLjQsMS43LDAuNywyLjYsMS4xYzIzLjcsOS45LDQ1LDIzLjMsNTguNywzNyAgIGMwLjIsMC4yLDAuNCwwLjQsMC42LDAuNmMxMywxMy4zLDE0LjQsMjEuOCwxMy4zLDI0LjRjLTMuNCw4LjEtMzkuOSwxNS4zLTk1LjMtNy44Yy0xNi4yLTYuOC0zMS40LTE1LjItNDMuNy0yNC4zICAgYy0wLjQsMC41LTAuOSwxLTEuMywxLjVjLTEyLjEsMTIuMS0zMS43LDEyLjEtNDMuOCwwQzI1OC44NSwxNDkuNTY5LDI1OC44NSwxMjkuOTY5LDI3MC45NSwxMTcuODY5eiIgZmlsbD0iIzkxREM1QSIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=" />
                            {{ result.tags.join(', ') }}
                        </p>
                    </div>
                </item>
                <p>&nbsp;</p>
            </virtual-list>

            <div id="main"
              class="pure-u"
              :class="{'main-collapsed': filterMenuCollapsed, 'main-modal': showMobilePostPreview, 'preview-collapsed': previewCollapsed}"
              @click="scrollTopList(showArticle.permlink)">
                <button
                  class="primary-button pure-button collapse-btn preview-collapsed-btn"
                  @click="toggleCollapsePreview">
                  <div style="display: block; marign: 0 auto;" class="collapse-btn-child">
                      <span v-show="previewCollapsed">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24" height="24"><defs><clipPath id="_clipPath_v1XZEi6sRMReNRt4JmibeQUvbDA9kH7c"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#_clipPath_v1XZEi6sRMReNRt4JmibeQUvbDA9kH7c)"><path d=" M 11 5 L 4 12 L 11 19" fill-rule="evenodd" fill="none" vector-effect="non-scaling-stroke" stroke-width="2" stroke="rgb(255,255,255)" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4"/></g></svg>
                      </span>
                      <span v-show="!previewCollapsed">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24" height="24"><defs><clipPath id="_clipPath_3MTA8wqwPkVSN5h1q6XiXxvpxaNsJ52i"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#_clipPath_3MTA8wqwPkVSN5h1q6XiXxvpxaNsJ52i)"><clipPath id="_clipPath_FFqARoG3YpBUCeh1ceqwiyB0wzN6ZyUD"><rect x="0" y="0" width="24" height="24" transform="matrix(1,0,0,1,0,0)" fill="rgb(255,255,255)"/></clipPath><g clip-path="url(#_clipPath_FFqARoG3YpBUCeh1ceqwiyB0wzN6ZyUD)"><g id="Group"><path d=" M 4 5 L 11 12 L 4 19" fill-rule="evenodd" fill="none" vector-effect="non-scaling-stroke" stroke-width="2" stroke="rgb(255,255,255)" stroke-opacity="100" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4"/></g></g></g></svg>
                      </span>
                    </div>
                </button>
                <button class="secondary-button pure-button close-main-btn most-right"
                  @click="closeMobilePreview"
                >Close</button>
                <div class="email-content">
                    <div class="error" v-if="error">
                      {{ error.message }} Let us know <a href="mailto:steemlookup@gmail.com">on our email</a>
                  </div>
                    <div class="email-content-header pure-g">
                        <div class="pure-u-3-4">
                            <h1 class="email-content-title">{{ showArticle.title }}</h1>
                            <p class="email-content-subtitle">
                                Created by <a target="_blank" :href="`https://${externalFe}/@${showArticle.author}`">{{ showArticle.author }}</a><br />at <span>{{ showArticle.created }}</span> <span style="float: right;">Steem Power: {{ showArticle.steem_power }}</span>
                            </p>
                        </div>

                        <div class="email-content-controls pure-u-1-4">
                            <a target="_blank" :href="`https://${externalFe}${externalFe === 'steemdb.com' ? '/steemit' : ''}/@${showArticle.permlink}`" class="secondary-button pure-button">Open</a>
                        </div>
                    </div>

                    <div class="email-content-body">
                        <vue-markdown
                          v-show="!mdIsRenederd"
                          id="showArticle"
                          style="width:100%;height:100%;"
                          :source="showArticle.body"
                          :anchor-attributes="anchorAttrs"
                          @rendered="getRenderedHtmlFromVueMD">
                        </vue-markdown>
                        <div
                          style="width:100%;height:100%;"
                          v-show="mdIsRenederd"
                          v-html="renderedHtml"></div>
                    </div>
                    <p>&nbsp;</p>
                </div>
            </div>
        </div>

        <!-- My Mackbot List -->
        <div v-if="showMyMackbotListModal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <span @click="closeMyMackbotListModal" class="close">&times;</span>
              <h2>Custom exclude List</h2>
            </div>
            <div class="modal-body">
              <ul v-if="myMackbotList.length" class="mackbot-list">
                <li v-for="username in myMackbotList" :key="username">
                  {{ username }}
                  <button
                    class="primary-button pure-button"
                    @click="removeFromMyMackbotList(username)">X</button>
                </li>
              </ul>

              <div>
                <input type="text"
                  v-model="newUserForMackbot"
                  placeholder="Add author to your custom exclude list"
                  style="width:70%;">
                <input
                  type="button"
                  class="primary-button pure-button u-gray"
                  @click="addToMyMackbotList(newUserForMackbot)"
                  :disabled="!newUserForMackbot"
                  value="Add"
                  style="width:25%;">
              </div>
            </div>
            <div class="modal-footer">
              <div>
                <button class="primary-button pure-button u-gray" @click="closeMyMackbotListModal">Close</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Save NEW search -->
        <div v-if="showSaveSearchModal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <span @click="cancelSaveSearch" class="close">&times;</span>
              <h2>Save new Search</h2>
            </div>
            <div class="modal-body">
              <div>
                <input type="text"
                  v-model="newSearchName"
                  placeholder="Enter name for new search">
                  <span v-if="searchNameAlreadyInUse" class="red">Search with this name already exist! Try different one.</span>
              </div>
            </div>
            <div class="modal-footer">
              <div>
                <button class="primary-button pure-button u-gray" @click="saveNewSearch">Save</button>
                <button class="primary-button pure-button u-gray" @click="cancelSaveSearch">Cancel</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Update selected search -->
        <div v-if="showUpdateSearchModal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <span @click="cancelUpdateSearch" class="close">&times;</span>
              <h2>Update existing Search</h2>
            </div>
            <div class="modal-body">
              <div>
                <p style="color: black;">Save As: <span style="font-weight: bold;">{{ selectedSearch }}</span>?</p>
                <br>
                <li v-for="search in savedSearches" :key="search.name" v-if="search.name !== selectedSearch">
                  <span style="color: black;">{{ search.name }}</span>
                  <button
                    class="primary-button pure-button save-btn"
                    @click="selectedSearch = search.name">Choose this</button>
                </li>
              </div>
            </div>
            <div class="modal-footer">
              <div>
                <button class="primary-button pure-button u-gray" @click="saveUpdatedSearch">Save</button>
                <button class="primary-button pure-button u-gray" @click="cancelUpdateSearch">Cancel</button>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import cloneDeep from "lodash.clonedeep";
import VueMarkdown from 'vue-markdown' // production
import virtualList from 'vue-virtual-scroll-list'
const supportedLanguages = require("./supportedLanguages.js");

export default {
  /** The name of the application. */
  name: "Search",
  components: {
    VueMarkdown,
    virtualList
  },
  data() {
    return {
      externalFe: 'steemit.com',
      nightMode: null,
      loading: false,
      supportedLanguages: supportedLanguages(),
      activeMenu: "",
      activePreview: null,
      lastSelectedPostIndex: 0,
      virtualListItemSize: 120,
      dataReady: null,
      totalResults: 0,
      error: null,
      page: 1,
      showArticle: {},
      savedSearches: [],
      showSaveSearchModal: false,
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
      querySteemPowerMin: "",
      querySteemPowerMax: "",
      queryPendingPayoutMin: "",
      queryPendingPayoutMax: "",
      tagsIncludeType: "any",
      tagsExcludeType: "any",
      queryTitleContains: "",
      queryBodyContains: "",
      queryTitleNotContains: "",
      queryBodyNotContains: "",
      queryMinutesAgoStart: 1440, // now - 24h
      queryMinutesAgoEnd: 0, // now
      queryLanguage: "",
      queryExcludeMackbot: false,
      queryMinutesAgoStartFormatted: "",
      queryMinutesAgoEndFormatted: "",
      selectedSearch: '',
      showMyMackbotListModal: false,
      queryExcludeMyMackbot: false,
      myMackbotList: [],
      newUserForMackbot: '',
      queryNumOfPostsToShow: "2000",
      anchorAttrs: {
        target: '_blank',
      },
      querySort: 'created-DESC',

      mdIsRenederd: false,
      renderedHtml: '',
      filterMenuCollapsed: false,
      showMobilePostPreview: false,
      isLoggedIn: false,
      token: '',
      showSaveSearchModal: false,
      newSearchName: '',
      searchNameAlreadyInUse: false,
      showUpdateSearchModal: false,
      previewCollapsed: false
    };
  },
  created() {
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    // console.log(Math.floor(y / 7));
    this.virtualListItemSize = Math.floor(y/7);

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
      let token = localStorage.getItem('SL-user-token')
      if(token) {
        this.token = token
        this.isLoggedIn = true
      }
    } catch (e) {
      console.log(e)
    }

    if(!this.isLoggedIn) {
      try {
        let savedSearches =
          JSON.parse(localStorage.getItem("SL-saved-searches")) || [];
        this.savedSearches = savedSearches;
      } catch (e) {
        console.warn("cant load saved searches");
      }

      try {
        let myMackbotList =
          JSON.parse(localStorage.getItem("SL-mackbot-list")) || [];
        this.myMackbotList = myMackbotList;
      } catch (e) {
        console.warn("cant load saved mackbot list");
      }
    }

    if (window.theme) {
      this.nightMode = window.theme === 'night-theme';
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
    const theme = this.nightMode ? 'night-theme' : 'day-theme';
    if (window.theme !== theme) {
      window.theme = theme;
      window.dispatchEvent(new Event('change-theme'));
    }
  },
  watch: {
    $route: "fetchData" // call again the method if the route changes
  },
  methods: {
    updateOnBlur() {
      this.fetchData();
    },
    fetchData(params = {}) {
      if (window.queryAlreadyInProgress) {
        return;
      }

      window.queryAlreadyInProgress = true;
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
          "querySteemPowerMin",
          "querySteemPowerMax",
          "queryPendingPayoutMin",
          "queryPendingPayoutMax",
          "tagsIncludeType",
          "tagsExcludeType",
          "queryTitleContains",
          "queryBodyContains",
          "queryTitleNotContains",
          "queryBodyNotContains",
          "queryMinutesAgoStart",
          "queryMinutesAgoEnd",
          "queryLanguage",
          "queryExcludeMackbot",
          "queryExcludeMyMackbot",
          "myMackbotList",
          "queryNumOfPostsToShow",
          "querySort"
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
            window.queryAlreadyInProgress = false;
            this.loading = false;
            if (response.data.totalResults > 0) {
              this.dataReady = response.data.results;
              this.totalResults = response.data.totalResults;
              if (!params.noLoading) {
                // this.showArticle = response.data.results[0];
                this.activePreview = this.showArticle.permlink;
                this.updateShowArticle(0, true);
              }
              this.error = null;
              if(response.data.userData) {
                try {
                  window.userLoggedIn = true;
                  this.isLoggedIn = true
                  this.token = response.data.userData.token
                  this.savedSearches = JSON.parse(response.data.userData.saved_searches) ? 
                    JSON.parse(response.data.userData.saved_searches) : []
                  this.myMackbotList = JSON.parse(response.data.userData.custom_user_list) ?
                    JSON.parse(response.data.userData.custom_user_list) : []
                } catch(e) {
                  console.log(e)
                }
              } else {
                this.isLoggedIn = false
              }
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
                  tags: ["needle in a haystack"],
                  title: "No results found matching your search criteria",
                  wordCount: 0,
                  thumbnails: [],
                  steem_power: 0
                }
              ];
              // this.error = { message: "No data matches your criteria" };
            }
          })
          .catch(e => {
            console.warn("cant load query data");
            this.loading = false;
            this.error = e;
            window.queryAlreadyInProgress = false;
          });
      });
    },
    saveNewSearch() {
      if (!this.newSearchName) {
        return
      }
      if (this.savedSearches.find(s => s.name === this.newSearchName)) {
        this.searchNameAlreadyInUse = true
        return
      }

      let obj2Save = {
        name: this.newSearchName
      };
      Object.keys(this)
        .filter(k => k.indexOf("query") === 0)
        .forEach(k => {
          obj2Save[k] = this[k];
        });
      this.savedSearches.push(obj2Save)

      if(this.isLoggedIn) {
        axios.post('/update-saved-searches', { savedSearches: JSON.stringify(this.savedSearches) })
          .then(response => {
            console.log(response)
            this.showSaveSearchModal = false
            alert(`Search: ${this.newSearchName} was successfully saved`)
          })
          .catch(error => {
            console.log(error)
            this.showSaveSearchModal = false
            this.error = { message: "Cant save this search" };
          })
      } else {
        try {
          let savedSearches = JSON.parse(localStorage.getItem("SL-saved-searches")) || [];
          savedSearches.push(obj2Save);
          this.savedSearches = savedSearches;
          localStorage.setItem(
            "SL-saved-searches",
            JSON.stringify(this.savedSearches)
          );
          // this.selectedSearch = ''
          this.showSaveSearchModal = false
          alert('Search: ' + this.newSearchName + ' was successfully saved.')
        } catch (e) {
          this.showSaveSearchModal = false
          this.error = { message: "Cant save this search." };
        }
      }
      this.searchNameAlreadyInUse = false
    },
    cancelSaveSearch () {
      this.showSaveSearchModal = false
      this.newSearchName = ''
    },
    saveUpdatedSearch () {
      if(!this.selectedSearch) {
        return
      }
      let obj2Save = {
          name: this.selectedSearch
        };
        Object.keys(this)
          .filter(k => k.indexOf("query") === 0)
          .forEach(k => {
            obj2Save[k] = this[k];
          });
      
      if(this.isLoggedIn) {
        let savedSearches = cloneDeep(this.savedSearches);
        savedSearches = savedSearches.filter(s => s.name !== this.selectedSearch)
        savedSearches.push(obj2Save)
        axios.post('/update-saved-searches', { savedSearches: JSON.stringify(savedSearches) })
          .then(response => {
            console.log(response)
            this.showUpdateSearchModal = false
            alert(`Search: ${this.selectedSearch} was successfully updated.`)
          })
          .catch(error => {
            console.log(error)
            this.showUpdateSearchModal = false
            this.error = { message: "Cant update this search." };
          })
      } else {
        this.savedSearches = this.savedSearches.filter(s => s.name !== this.selectedSearch)
        this.savedSearches.push(obj2Save)
        try {
          localStorage.setItem('SL-saved-searches', JSON.stringify(this.savedSearches))
          this.showUpdateSearchModal = false
        } catch (e) {
          console.log(e)
          this.showUpdateSearchModal = false
          this.error = { message: "Cant update this search." }
        }
      }
    },
    cancelUpdateSearch () {
      this.showUpdateSearchModal = false
    },
    restoreSearch(name) {
      try {
        this.selectedSearch = name
        let savedSearches
        if(!this.isLoggedIn) {
          savedSearches = JSON.parse(localStorage.getItem("SL-saved-searches")) || [];
        } else {
          savedSearches = this.savedSearches
        }
  
        let targetSearch = savedSearches.filter(s => s.name === name)[0];
        if (targetSearch) {
          Object.keys(targetSearch)
            .filter(k => k.indexOf("query") === 0)
            .forEach(k => {
              this[k] = targetSearch[k];
            });
        }
      } catch (e) {
        this.selectedSearch = ''
        this.error = { message: "Cant restore this search" };
      }
    },
    removeSearch(name) {
      this.selectedSearch = ''
      try {
        let savedSearches
        if(!this.isLoggedIn) {
          savedSearches = JSON.parse(localStorage.getItem("SL-saved-searches")) || [];
          this.savedSearches = savedSearches.filter(s => s.name != name);
          localStorage.setItem(
            "SL-saved-searches",
            JSON.stringify(this.savedSearches)
          );
        } else {
          savedSearches = cloneDeep(this.savedSearches)
          savedSearches = savedSearches.filter(s => s.name !== name);
          axios.post('/update-saved-searches', { savedSearches: JSON.stringify(savedSearches) })
            .then(response => {
              console.log(response)
              this.savedSearches = savedSearches;
            })
            .catch(error => {
              console.log(error)
            })
        }
      } catch (e) {
        this.selectedSearch = ''
        this.error = { message: "Cant remove this search" };
      }
    },
    updateSearch () {
      console.log('clicked update search')
    },
    updateShowArticle(index, hideOnMobile) {
      if(hideOnMobile) {
        this.showMobilePostPreview = false
      } else {
        this.showMobilePostPreview = true
      }
      this.mdIsRenederd = false
      this.showArticle = JSON.parse(JSON.stringify(this.dataReady[index]));
      this.showArticle.created = new Date(this.showArticle.created).toString(
        "MMM d yyyy HH:mm:ss"
      );
      this.showArticle.body = "...";
      axios
        .post(`/query-post`, this.showArticle)
        .then(responsePost => {
          this.showArticle = responsePost.data;
          this.showArticle.created = new Date(this.showArticle.created).toString(
        "MMM d yyyy HH:mm:ss");
          // this.showArticle.body = responsePost.data.body
          // document.getElementById("showArticle").innerHTML =
          //   responsePost.data.body;
        })
        .catch(e => {
          console.warn("cant load post data", e);
        });

      this.activePreview = this.dataReady[index].permlink;
    },
    getRenderedHtmlFromVueMD (renderedHtml) {
      renderedHtml = renderedHtml
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
      let exp = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))/ig;
      let foundUrls = renderedHtml.match(exp)
      if(foundUrls) {
        foundUrls.forEach(url => {
          let indexOfUrl = renderedHtml.indexOf(url)
          let endOfUrl = indexOfUrl + url.length
          if(
            renderedHtml.slice(indexOfUrl -5, indexOfUrl).indexOf('src') > -1 ||
            renderedHtml.slice(indexOfUrl -7, indexOfUrl).indexOf('href') > -1
          ) {
            // console.log("HAS IMG TAG")
          } else {
            renderedHtml = [
              renderedHtml.slice(0,indexOfUrl), 
              '<img src="', 
              renderedHtml.slice(indexOfUrl, endOfUrl),
              '">',
              renderedHtml.slice(endOfUrl) 
            ].join('')
          }
        })
      }
      this.renderedHtml = renderedHtml
      this.mdIsRenederd = true
    },
    toggleMenu() {
      this.activeMenu = this.activeMenu ? "" : "active";
    },
    closeX() {
      this.error = null;
      location.reload();
    },
    scrollTopList(permlink) {
      let activePost = this.dataReady.find((element, index) => element.permlink === permlink)
      if(activePost !== undefined) {
        this.lastSelectedPostIndex = this.dataReady.indexOf(activePost) + 1
        this.$nextTick(() => {
          this.lastSelectedPostIndex = this.dataReady.indexOf(activePost)
        })
      } else {
        // TODO: post not in results anymore
      }
    },
    openMyMackbotListModal () {
      this.showMyMackbotListModal = true
    },
    closeMyMackbotListModal () {
      this.showMyMackbotListModal = false
    },
    addToMyMackbotList (username) {
      if(!this.myMackbotList.includes(username)) {
        this.myMackbotList.push(username)
        this.updateSLMackbotList()
        this.newUserForMackbot = ''
      } else {
        alert("User is already in your Mackbot list")
      }
    },
    removeFromMyMackbotList (username) {
      if(this.myMackbotList.includes(username)) {
        let indexOfSelected = this.myMackbotList.indexOf(username)
        this.myMackbotList.splice(indexOfSelected, 1)
        this.updateSLMackbotList()
      }
    },
    updateSLMackbotList () {
      if(!this.isLoggedIn) {
        try {
          localStorage.removeItem('SL-mackbot-list')
          localStorage.setItem(
            'SL-mackbot-list',
            JSON.stringify(this.myMackbotList)
          );
        } catch (e) {
          console.log('Error updating mackbot list')
        }
      } else {
        axios.post(`/update-custom-user-list`, {customUserList: JSON.stringify(this.myMackbotList)})
          .then(response => {
            alert(`Custom list was successfully updated.`)
          })
          .catch(error => {
            this.error = { message: `Can't update custom list.` };
          })
      }
    },
    toggleCollapseFilter () {
      this.filterMenuCollapsed = !this.filterMenuCollapsed
    },
    closeMobilePreview () {
      this.showMobilePostPreview = false
    },
    updateRemoteSavedSearches () {
      console.log('remote searches')
    },
    updateRemoteCustomeExclList () {
      console.log('remote exclude list')
    },
    toggleCollapsePreview () {
      this.previewCollapsed = !this.previewCollapsed
    }
  }
};
</script>
