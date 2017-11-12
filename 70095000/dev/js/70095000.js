define('tpl70095000', ['zepto', 'vr', 'request', 'x', 'service'], function ($, VR, request, x, service) {

    return function (data) {
        var classId = data.classId,
            rankId = data.rankId,
            tcurl = data.tcurl.replace(/&amp;/g, '&'),
            query = data.query,
            queryObj = VR.qoQuery(data.query),
            selectTypes = data.selectTypes,
            tag = VR.removeHighlight(data.tag);
        var vr = new VR(classId, rankId, tcurl);
        var $tvseries = vr.$(),
            $tvseriesTitle = vr.$("tvseriesTitle"),
            $tvseriesSelectTab = vr.$("tvseriesSelectTab"),
            $selectLayout = $tvseries.find(".select-layout"),
            $selectLevelOption = $tvseries.find(".select-level-option"),
            //$tvseriesType = $("#" + n("tvseriesType")),
            $tvseriesList = vr.$("tvseriesList"),
            $loading = $tvseries.find("._tvseries_loading"),
            $error = $tvseries.find("._tvseries_error"),
            $noresult = $tvseries.find("._tvseries_noresult"),
            $show = $tvseries.find("._tvseries_show"),
            //$tvseriesSlide = $("#" + n("tvseriesSlide")),
            //$cur = $tvseriesType.find(".buoy"),
            $showListItem = null,
            $showListTv = null;

        if (selectTypes && selectTypes != '') {
            selectTypes = JSON.parse(data.selectTypes);
        } else {
            $tvseries.hide();
        }

        var isTypeShow = false,
            isRedirect = true, //是否跳转
            moreClickNum = 0,
            userQuery = window.oldQuery,
            scrollTopDistance = $tvseries.offset().top,
            defaultSortTxt = '最热';
        defaultSortRules = '2::desc||1::desc';
        var qoOption = {
            query: data.query, //type::韩剧::0;year1::2016::0;year2::80年代::0;area::韩国::0;actor,director;
            vrQuery: data.query,
            classId: classId,
            classTag: 'MULTIHIT.TVserious.Category',
            tplId: '70095000',
            sortRules: '2::desc||1::desc', //最热2::desc||1::desc;最新3::desc;好评4::desc
            start: 0,
            item_num: 25,
            queryFrom: 'wap',
            pageTurn: 1  //是否翻页
        }

        var tvseriesTemplate = '<a href="${tvUrl}" class="item-text">\
                                        <div class="img-tag">\
                                            <img class="pic-box" style="background-size: cover; background-repeat: no-repeat;" data-src="${tvImg}">';
            if(tag == '电影'){
                tvseriesTemplate += '<p class="about-img about-img-text">\
                                        <span class="about-date" style="${movieStyle}">${year1}</span>\
                                        <span class="about-score" style="${scoreStyle}">${score}分</span>\
                                    </p>';
            }else{
                tvseriesTemplate += '<p class="about-img" style="overflow: hidden;">${tvStatus}</p>';
            }                     
            tvseriesTemplate +=  '</img>\
                                    </div>\
                                    <h4 class="item-title align-left">${tvName}</h4>\
                                </a>';
            tvListTemplate = '<div class="tv-list" style="display:none;">\
                                  <div class="scroll-layout scroll-layout-default"><div class="item-list">${tvHTML1}</div></div>\
                                  <div class="scroll-layout scroll-layout-default" style="${tvstyle2}"><div class="item-list">${tvHTML2}</div></div>\
                              </div>';

        var initTitleAndQuery = function () {
            var queryStr = window.oldQuery, queryfortitletxt = '', queryValue = '', queryValueArr=[],titleStr = '';
            var selectData = {};
            $.each(selectTypes,function(i,value){
                selectData[value.name] = value.data.slice() ;
                if(value.name == 'type'){
                    value.data.length = 10 ;
                }
            });
                var  leixingForTitleUrl = '';
            $.each(queryObj, function (i, n) {
                if(i == 'tag'){
                    return;
                }
                queryfortitletxt = queryValue = VR.toDBC(n).replace(/\u3000/, ' ');
                if( i == 'type' || i == 'type1' || i == 'type2' || i == 'area' || i == 'leixing'){
                    if(queryValue.indexOf(';')!= -1){
                        queryValueArr = queryValue.split(';');
                        queryValueArr.forEach(function(val1){
                            // selectData['type1']与type完全相同
                            selectData[i] = selectData[i] || selectData['type'] ;
                            //获取title的跳转url拼接词，和二次拉去的关键词；
                            for(var j=0; j< selectData[i].length; j++){
                                if(selectData[i][j] == val1){
                                    queryValue = selectData[i][j];
                                    break;
                                }
                            }
                            if(i == 'leixing'){
                                for(var j=0; j< selectData['area'].length; j++){
                                    if(selectData['area'][j] == val1){
                                        leixingForTitleUrl = selectData['area'][j];
                                        break;
                                    }
                                }
                            }
                             if(queryStr.indexOf(val1)!= -1){
                                // 获取title的显示；
                                queryfortitletxt = val1 ;
                            }
                        });
                    }
                } else {
                    queryValueArr = queryValue.split(';');
                    queryValueArr.forEach(function (val2) {
                        if (~queryStr.indexOf(val2)) {
                            queryValue = val2;
                            queryfortitletxt = val2;
                        }
                    });
                }
                if (classId == "70005120") {
                    queryObj[i] = queryValue;
                    titleStr = queryfortitletxt+titleStr;
                } else {
                    queryObj[i] = queryValue;
                    titleStr += queryfortitletxt;
                }
            });
            if(queryObj.hasOwnProperty('tag')){
                titleStr += queryObj['tag'];
            }
            titleStr = '<em>'+titleStr+'</em>大全';
            $tvseriesTitle.html(titleStr);
            var  titleUrlObj = {
                '电影': 'http://m.v.sogou.com/film/list/',
                '电视剧':'http://m.v.sogou.com/teleplay/list/',
                '动漫': 'http://m.v.sogou.com/cartoon/list/',
                '综艺': 'http://m.v.sogou.com/tvshow/list/'
            };
            var href = titleUrlObj[queryObj['tag']||'电视剧'];
            if(queryObj['type']!= undefined && queryObj['type1'] != undefined){
                href = 'http://m.v.sogou.com/v?query=';
                var queryPinjie = '';
                for(var key in queryObj){
                    queryPinjie += queryObj[key] ;
                }
                href += encodeURIComponent(queryPinjie);
            }else{
                if(queryObj['type']!= undefined || queryObj['type1'] != undefined || queryObj['type2'] != undefined){
                    href += 'style-'+encodeURIComponent(queryObj["type"]||queryObj["type1"]||queryObj["type2"]);
                }
                if(queryObj["area"]!=undefined || leixingForTitleUrl){
                    href += '+zone-'+encodeURIComponent(queryObj["area"]||leixingForTitleUrl);
                }
                if(queryObj["year1"]!=undefined){
                    href += '+year-'+encodeURIComponent(queryObj["year1"]) ;
                }
                if(queryObj['year2']!=undefined){
                    var year2Obj = {
                        '00年代':'2000',
                        '90年代':'1990',
                        '80年代':'1980',
                        '70年代':'2970',
                        '更早':'更早'
                    };
                    href += '+year-'+encodeURIComponent(year2Obj[queryObj["year2"]]) ;
                }
                if(queryObj['tag']=='综艺' && (queryObj["actor"]!=undefined||queryObj["director"]!=undefined||queryObj["actordirector"]!=undefined)){
                    href += '+emcee-'+encodeURIComponent(queryObj["actor"]||queryObj["director"]||queryObj["actordirector"]);
                }else if(queryObj["actor"]!=undefined||queryObj["director"]!=undefined||queryObj["actordirector"]!=undefined){
                    href += '+starring-'+encodeURIComponent(queryObj["actor"]||queryObj["director"]||queryObj["actordirector"]);
                }
            }
            $tvseriesTitle.attr('href', vr.getURL(href+'.html'));
        },
        imgLoad = function (coverDiv, src, callback, error,pHeight) {
            var tempImg = new Image();
            tempImg.onload = function () {
                callback.call(tempImg, coverDiv, src, tempImg.width);
                tempImg.onload = null;
            }
            tempImg.onerror = tempImg.onabort = function () {
                error.call(tempImg, coverDiv);
                tempImg.onabort = tempImg.onerror = null;
            };
            tempImg.src = src;
        },
        onHandleImgs = function ($parent) {
            var pWidth = 0, pHeight = 0, imgWidth = 0, imgHeight = 0;
            $parent.find(".item-text").each(function (_, elem) {
                var _this = $(elem).find(".pic-box");
                //if (!$(this).attr("data-done")) {
                pWidth = $(elem).width();
                pHeight = pWidth * (4 / 3);
                imgLoad(_this, $(_this).attr("data-src"), function (cover, src, pWidth) {
                    $(cover).parent().css("background","url('"+src+"')");
                    $(cover).parent().css("background-size","cover");
                }, function (cover) { },pHeight);
                //}
            });
        },
        onResize = function ($parent) {
            $(window).on("resize",function(){
                var pWidth = 0, pHeight = 0, imgWidth = 0, imgHeight = 0;
                $parent.find(".item-text").each(function (_, elem) {
                    var _this = $(elem).find(".pic-box");
                    //if (!$(this).attr("data-done")) {
                    pWidth = $(elem).width();
                    pHeight = pWidth * (4 / 3);
                    imgLoad(_this, $(_this).attr("data-src"), function (cover, src, pWidth) {
                        $(cover).parent().css("background","url('"+src+"')");
                        $(cover).parent().css("background-size","cover");
                    }, function (cover) { },pHeight);
                    //}
                });

            })
        },
        initSelectTab = function () {
            //初始化类别
            selectTypes.forEach(function (item, i) {
                if (~item.name.indexOf("year")) {
                    item.data.forEach(function (subitem, j) {
                        $tvseriesSelectTab.find("._tvseries_year").find("ol").append('<li>' + subitem + '</li>')
                    });
                } else {
                    item.data.forEach(function (subitem, j) {
                        $tvseriesSelectTab.find("._tvseries_" + item.name).find("ol").append('<li>' + subitem + '</li>')
                    });
                }
            })
            $tvseriesSelectTab.find(".select-level-option").each(function () {
                $(this).find("li").removeClass("active").eq(0).addClass("active");
            })
            //带入命中
            $.each(queryObj, function (key, value) {
                if (key == 'actor' || key == 'director') {
                    isRedirect = false;
                }
            });
            if (~userQuery.indexOf("最新")) {
                $tvseriesSelectTab.find("p.select-text").eq(0).html("最新");
                $tvseriesSelectTab.find('.select-level-option').eq(0).find('li').removeClass("active").eq(1).addClass("active");
                loadTvSeries('', '最新');
            } else if ((~userQuery.indexOf("好评") || ~userQuery.indexOf("评分")) && ~tag.indexOf('电影')) {
                $tvseriesSelectTab.find("p.select-text").eq(0).html("好评");
                $tvseriesSelectTab.find('.select-level-option').eq(0).find('li').removeClass("active").eq(2).addClass("active");
                loadTvSeries('', '好评');
            }
        },
        getQuery = function (key, value) {
            if (key == 'year') {
                if (isNaN(value)) {
                    key = 'year2';
                    queryObj['year1'] = '';
                } else {
                    key = 'year1';
                    queryObj['year2'] = '';
                }
            }
            queryObj[key] = value;
            var newQuery = [];
            $.each(queryObj, function (key, value) {
                value && value != '全部' && value != '' ? newQuery.push(key + "::" + value + "::0") : '';
            });
            return newQuery.join("||");
        },
        successFun = function (xml) {
            $error.hide();
            $loading.hide();
            $show.next().hide();
            if (!xml[0]) {
                $noresult.show();
                $tvseriesList.hide();
                $show.hide();
                return;
            }
            xml = xml[0].xml;
            $tvseriesList.show();
            $noresult.hide();
            $show.show();
            moreClickNum = 0;
            var tvHTML = [], tvHTML1 = [], tvHTML2 = [], tvHTML3 = [], itemNums = 0, subitems = x(xml).find("//display/subitem"), $zhankai = null;
            itemNums = subitems.length;
            subitems.each(function (elem, i) {
                var score = ~tag.indexOf('电影') ? x(elem).find("subdisplay/score").text() : '',
                    year = ~tag.indexOf('电影') ? x(elem).find("subdisplay/year1").text() : '';
                year = (year && year != '0') ? year : '';
                score = (score && score != '0' && score != '0.0') ? score : '';
                //if (isRedirect ? (i < 54) : true) {
                if (i % 8 === 0 && i != 0) {
                    tvHTML.push(service.format(tvListTemplate, {
                        tvHTML1: tvHTML1.join(''),
                        tvHTML2: tvHTML2.join('')
                    }));
                    tvHTML1 = [], tvHTML2 = [];
                }
                if(tvHTML1.length<4){
                    tvHTML1.push(service.format(tvseriesTemplate, {
                        tvUrl: vr.getURL(x(elem).find("subdisplay/detaillink").text(), 'tv'),
                        tvImg: httpsUtil.getCdnImgLink(x(elem).find("subdisplay/image").text()),
                        tvStatus: x(elem).find("subdisplay/status").text(),
                        tvName: x(elem).find("subdisplay/name").text(),
                        movieStyle: (year || score) ? '' : 'display:none;',
                        hotStyle: ~tag.indexOf('电影') && (x(elem).find("subdisplay/hotshow").text() == '1') ? '' : 'display:none;',
                        scoreStyle: score ? '' : 'display:none;',
                        year1: year,
                        score: score
                    }));
                }else{
                    tvHTML2.push(service.format(tvseriesTemplate, {
                        tvUrl: vr.getURL(x(elem).find("subdisplay/detaillink").text(), 'tv'),
                        tvImg: httpsUtil.getCdnImgLink(x(elem).find("subdisplay/image").text()),
                        tvStatus: x(elem).find("subdisplay/status").text(),
                        tvName: x(elem).find("subdisplay/name").text(),
                        movieStyle: (year || score) ? '' : 'display:none;',
                        hotStyle: ~tag.indexOf('电影') && (x(elem).find("subdisplay/hotshow").text() == '1') && (defaultSortTxt == '最新') ? '' : 'display:none;',
                        scoreStyle: score ? '' : 'display:none;',
                        year1: year,
                        score: score
                    }));
                }
            });
            var num = 0;
            if(0<tvHTML1.length&&tvHTML1.length<4){
                num = 4-tvHTML1.length;
                for(var i = 0;i<num;i++){
                    var str = "<div class='item-text'><div class='img-tag' style='background:url()'></div></div>";
                    tvHTML1.push(str);
                };
            }else if(tvHTML1.length==4&&0<tvHTML2.length&&tvHTML2.length<4){
                num = 4-tvHTML2.length;
                for(var i = 0;i<num;i++){
                    var str = "<div class='item-text' ><div class='img-tag' style='background:url()'></div></div>"
                    tvHTML2.push(str);
                };
            }
            tvHTML.push(service.format(tvListTemplate, {
                tvHTML1: tvHTML1.join(''),
                tvHTML2: tvHTML2.join(''),
                tvstyle2: tvHTML2.length < 1 ? 'display:none;' : ''
            }));
            $tvseriesList.html(tvHTML.join(''));
            $showListTv = $tvseriesList.find(".tv-list").eq(0).show();
            if (itemNums <= 9) {
                $show.hide();
            }
            onHandleImgs($showListTv);
            if(queryObj['tag'] == "综艺"){
                handleText();
            }
        },
        errorFun = function () {
            $tvseriesList.hide();
            $error.show();
            $noresult.hide();
            $loading.hide();
            $show.hide();
            $show.next().hide();
        },
        loadTvSeries = function (type, value) {
            $tvseriesList.hide();
            $error.hide();
            $show.next().hide();
            $noresult.hide();
            $loading.show();
            if (type != '') {
                query = getQuery(type, value);
            }else{
                query = getQuery('','');
            }
            if (value == '最新') {
                defaultSortRules = '3::desc';
                defaultSortTxt = value;
            } else if (value == '最热') {
                defaultSortRules = '2::desc||1::desc';
                defaultSortTxt = value;
            } else if (value == '好评') {
                defaultSortRules = '4::desc';
                defaultSortTxt = value;
            }
            request.query({
                'qo': $.extend(qoOption, {
                    query: query,
                    vrQuery: query,
                    item_num: isRedirect ? 54 : 200,
                    sortRules: defaultSortRules
                }),
                'filter': false,
                'success': successFun,
                'error': errorFun
            })
            //request.query($.extend(qoOption, {
            //    query: query,
            //    vrQuery: query,
            //    item_num: isRedirect ? 54 : 200,
            //    sortRules: defaultSortRules
            //}), successFun, errorFun);
        },
        typeClick = function () {
            $tvseriesSelectTab.find(".select-layout").each(function (i) {
                $(this).click(function () {
                    vr.pb('tab');
                    var $curSelectTabElem = $(this).find("p.select-text"),
                        $cur = $(this).parent().find("div[typelist='"+$curSelectTabElem.attr("choosetext")+"']"),
                        clickType = $cur.find("div[data-type]").attr("data-type");
                    if ($curSelectTabElem.attr("data-show") == 'yes') {
                        $tvseriesSelectTab.find("p.select-text").attr("data-show", "no");
                        $cur.hide();
                        $(this).removeClass('active');
                    } else {
                        $tvseriesSelectTab.find("p.select-text").attr("data-show", "no");
                        $selectLevelOption.hide();
                        $cur.show();
                        $curSelectTabElem.attr("data-show", "yes");
                        $(this).siblings().removeClass('active');
                        $(this).addClass('active');
                    }
                    $cur.find("li").click(function () {
                        var $ele = $tvseriesSelectTab.find("div.select-layout").find("p.select-text[choosetext='"+$(this).parent().find("li[data-content]").attr("data-content")+"']");
                        vr.pb('shaixuanbtn');
                        $cur.find("li").removeClass("active");
                        $(this).addClass("active");
                        $tvseriesSelectTab.find("div.select-layout").find("p.select-text").attr("data-show", "no");
                        $selectLevelOption.hide();
                        $ele.html($(this).text() == '全部' ? "全部" : $(this).text());
                        $(".select-layout").removeClass('active');
                        loadTvSeries(clickType ? clickType : '', $(this).text());
                    });
                });
            });
            
        },
        moreClick = function () {
            var showNewList = function ($list) {
                $list.show();
                onHandleImgs($list);
            }
            $show.click(function () {
                vr.pb('imgmore');
                moreClickNum++;
                $showListTv = $tvseriesList.find(".tv-list").eq(moreClickNum).css("padding-top","0px");
                var $nextListTv = $tvseriesList.find(".tv-list").eq(moreClickNum + 1);
                var tvNums = $tvseriesList.find(".pic-box").length;
                //if (isRedirect) {
                //    if (tvNums >= 54) {
                //        if ($showListTv.length < 1) {
                //            //window.location.href = vr.getURL(morelink + encodeURIComponent(showleixing == '全部' ? '电视剧' : showleixing), 'more');
                //        } else {
                //            showNewList($showListTv);
                //        }
                //    } else {
                //        if ($nextListTv.length < 1) { //翻到最后一页
                //            $show.hide().next().show();
                //        }
                //        showNewList($showListTv);
                //    }
                //} else {
                if (moreClickNum == ($tvseriesList.find(".tv-list").length - 1)) { //翻到最后一页
                    $show.hide().next().show();
                }
                showNewList($showListTv);
                //}
            });
            $show.next().click(function () {
                vr.pb('imgshouqi');
                $tvseriesList.find(".tv-list").hide().eq(0).show();
                $(this).hide().prev().show();
                moreClickNum = 0;
                window.scrollTo(0, scrollTopDistance);
            })
        },
        handleScore = function  () {
            var $scoreEle = $("p.about-img-text span.about-score");
            $scoreEle.each(function(index,item){
                if($(item).height()>20){
                    $(item).hide();
                }
            })
        },
        handleText = function () {
                var imgTexts = $(".about-img");
                imgTexts.each(function(index,item){
                    var text = $(item).text();
                    text = text.substring(2);
                    $(item).text(text);
                })
        },
        cutStr = function(str,len,boolean){
                var bytesCount = 0,strTemp="";
                for(var i =0;i<str.length;i++){
                    if(bytesCount<len){
                        var c = str.charAt(i);
                        if(/^[\u0000-\u00ff]$/.test(c)){
                            bytesCount+=1;
                        }else{
                            bytesCount+=2;
                        }
                        strTemp += str.charAt(i);
                    }else{
                        strTemp=strTemp.substring(0,strTemp.length-2);
                        if(boolean)strTemp+="...";
                        i=str.length;
                    }
                }
                return strTemp;
            },
            checkPicNumber = function () {
                var itemList = $("#sogou_vr_"+classId+"_"+rankId).find("div.item-list").last(),div,num;
                if(itemList.find("a").length<4){
                    num = 4 - itemList.find("a").length;
                    for(var i = 0;i<num;i++){
                        var div = document.createElement("div");
                        $(div).attr("class","item-text");
                        $(div).html("<div class='img-tag' style='background:url()'></div>");
                        itemList.append(div);
                    }
                }

            };
        function init() {
            initTitleAndQuery();
            initSelectTab();
            typeClick();
            moreClick();
            handleScore();
          //  checkPicNumber();
            $showListTv = $tvseriesList.find(".tv-list").eq(0);
            onHandleImgs($showListTv);
            onResize($showListTv);
            if(queryObj['tag'] == "综艺"){
                handleText();
            }
            $error.click(function () {
                $tvseriesList.hide();
                $error.hide();
                $noresult.hide();
                $loading.show();
                request.query({
                    'qo': $.extend(qoOption, {
                        query: query,
                        vrQuery: query,
                        item_num: isRedirect ? 54 : 200,
                        sortRules: defaultSortRules
                    }),
                    'filter': false,
                    'success': successFun,
                    'error': errorFun
                })
            });

        }
        if (rankId > 5) {
            $(function () {
                init();
            });
        } else {
            setTimeout(function () {
                init();
            }, 10);
        }
    };
});