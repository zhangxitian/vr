define('tpl70095001', ['vr', "zepto", "vr.swiper","getLeftWidth"], function (VR, $, Swiper, getLeftWidth) {

    //获取滚动高度
    var systemScrollY = new function(){
        var pageYE, scrollYE, scrollTopE;
        return function(){
            if(pageYE){
                return pageYE.pageYOffset;
            }
            else if(scrollYE){
                return scrollYE.scrollY;
            }
            else if(scrollTopE){
                return scrollYE.scrollTop;
            }
            if(typeof(window.pageYOffset) === "number" && window.pageYOffset >= 0){
                pageYE = window;
                return window.pageYOffset;
            }
            if(typeof(window.scrollY) === "number" && window.scrollY >= 0){
                scrollYE = window;
                return window.scrollY;
            }
            if(document.documentElement && typeof(document.documentElement.scrollTop)==="number"
                && document.documentElement.scrollTop >= 0){
                scrollTopE = document.documentElement;
                return scrollTopE.scrollTop;
            }
            if(document.body.parentNode && typeof(document.body.parentNode.scrollTop)==="number"
                && document.body.parentNode.scrollTop >= 0){
                scrollTopE = document.body.parentNode;
                return scrollTopE.scrollTop;
            }
            if(typeof(document.body.scrollTop)==="number"
                && document.body.scrollTop >= 0){
                scrollTopE = document.body;
                return scrollTopE.scrollTop;
            }
            return 0;
        }
    };
    //切图
    var getImgSrc=function(src,w,h){
        h=h?h:w;
        return ['//img01.sogoucdn.com/v2/thumb/resize/h/'+h+'/crop/w/'+w+'/h/'+h+'?appid=200658&url=',encodeURIComponent(src)].join("");
    }
    var getImgSrc34=function(src){
        //var w=150,h=200;
        return ['//img01.sogoucdn.com/v2/thumb/resize/h/200/crop/w/150/h/200?appid=200658&url=',encodeURIComponent(src)].join("");
    };

    return function (classId, rank, tcurl, jujis, fenlei, qoinfo) {
        var vr = new VR(classId, rank, tcurl);
        var $vr= vr.$(), dis=[], wScroll, scroller1,scroller2, $erPage=vr.$("erpage");
        var oncehide = false;
        var gengarr = [];//可轮播数据集
        var quanarr = [];//vr下方列表数据
        var activeErpage = null;//二级页中当前活动tab,1=全部，2=推荐，0=vr页
        var isload1 = false;//er1是否加载中
        var isload2 = false;//er2是否加载中
        var fanyenum=1;//二级页全部剧集加载次数
        var tjnum=1;//二级页推荐加载次数
        var queryObj=VR.qoQuery(qoinfo);
        var selectTypes = fenlei&&JSON.parse(fenlei);
        var $tvseriesTitle = vr.$("tvseriesTitle");
        var initWidth=$vr.find(".vr-tv171010").width()||($erPage.width()-38);
        var imgWidth=getLeftWidth(initWidth,userGroupId);
        var userQuery=window.oldQuery;
        var sort="2::desc||1::desc";//排序默认最热

        function initDataJuji(){
            for(var i=0;i<jujis.length;i++){
                if(jujis[i].status.indexOf("更至")!=-1&&jujis[i].bigimage!=''&&gengarr.length<9){
                    gengarr.push(jujis[i]);
                }else{
                    quanarr.push(jujis[i]);
                }
            }
        }

        function onHandleHeader(){
            // if(gengarr.length==0){
            //     //title
            // }else{
                var num=getCookie("sogou_vr_70095000_leibie");
                jujiLunbo(num);
                if(num){
                    //cookie上限值。。两组数据轮播的情况下cookie值上限2
                    var limitnum=3;
                    if(gengarr.length>3&&gengarr.length<=6){
                        limitnum=2;
                    }
                    num=num==limitnum?1:(Number(num)+1);
                    setCookie("sogou_vr_70095000_leibie",num,10);
                }else{
                    setCookie("sogou_vr_70095000_leibie","1",10);
                }
            //}
        }
        /*
            a)	用户第一次访问，从返回的数据中取出状态包含【更至】前3条数据进行展现，
            b)	同一个用户第二次访问，则展现第4-6条数据
            c)	同一个用户第三次访问，则展现7-9条数据
            d)	在这9条数据中，没有展现的数据在【数据区】中展现
            e)	最多变换3次数据
            f)	如果数据不足3条，则有几条展现几条，包括同一个多次访问
            g)	如果数据不足9条，则按正常的轮换，如数据为8条，第一次访问3条，第二次访问3条，
                第三次访问2条；如果数据为5条，第一次访问3条，第二次访问2条，第三次访问3条
        */
        function jujiLunbo(num){
            var len=gengarr.length;
            if(len>=0&&len<=3){
                var quan1arr;
                if(num==1){
                    quan1arr=quanarr.slice(6);
                }else if(num==2){
                    quan1arr=quanarr.slice(12);
                }else{
                    quan1arr=quanarr;
                }
                drawHtml(gengarr,quan1arr);
            }else if(len>3&&len<=6){
                var geng1arr=gengarr.slice(0,3);
                var geng2arr=gengarr.slice(3);
                if(num==1||num==3){
                    var quan2arr=geng1arr.concat(quanarr.slice(geng2arr.length));
                    drawHtml(geng2arr,quan2arr);
                }else{
                    var quan1arr=geng2arr.concat(quanarr);
                    if(num==2){
                        quan1arr=quanarr.slice(9-geng2arr.length)
                    }
                    drawHtml(geng1arr,quan1arr);
                }
            }else{
                var geng1arr=gengarr.slice(0,3);
                var geng2arr=gengarr.slice(3,6);
                var geng3arr=gengarr.slice(6);
                if(num==1){
                    var quan2arr=geng1arr.concat(quanarr);
                    drawHtml(geng2arr,quan2arr);
                }else if(num==2){
                    var quan3arr=quanarr.slice(3);
                    drawHtml(geng3arr,quan3arr);
                }else{
                    var quan1arr=geng2arr.concat(geng3arr).concat(quanarr);
                    drawHtml(geng1arr,quan1arr);
                }
            }
        }
        //渲染vr轮播区和数据列表区
        function drawHtml(toparr,allarr){
            var htmltop=[],htmlbottom=[],arrI=[];
            if(toparr.length>0){
                for(var i=0;i<toparr.length;i++){
                    var templateA= '<a style="width:100%" href="{href}" class="image">\
                    <img src="{imgsrc}" alt=""/>\
                    <i></i>\
                    <div class="mask"></div> \
                    <div class="content">\
                        <h4 class="ellipsis">{name}（{status}）</h4>\
                        <p class="ellipsis">{yijujieshao}</p>\
                    </div>\
                </a>';
                    templateA=templateA.replace("{href}",vr.getURL(toparr[i].detaillink,"luboimg"));
                    templateA=templateA.replace("{imgsrc}",toparr[i].bigimage);
                    templateA=templateA.replace("{name}",toparr[i].name);
                    templateA=templateA.replace("{status}",toparr[i].status);
                    templateA=templateA.replace("{yijujieshao}",toparr[i].yijujieshao);
                    htmltop.push(templateA);
                    arrI.push(arrI.length>0?'<i></i>':'<i class="active"></i>');
                }
                vr.$("lunbo").html(htmltop.join(""));
                if(arrI.length>1){
                    $vr.find(".box-toggle").html(arrI.join(""));
                }
            }else{
                $tvseriesTitle.show();
            }

            var listlen=allarr.length>6?6:allarr.length;
            for(var i=0;i<listlen;i++){
                var templateB='<a href="{href}" class="item-text class-name" style="width:33.33%">\
                        <div class="img-tag img-height" style="padding-bottom:133%">\
                            <img src="{image}" alt=""/>\
                        </div>\
                        <h4 class="item-title">{name}</h4>\
                        <time class="item-time">{status}</time>\
                    </a>';
                templateB=templateB.replace("{href}",vr.getURL(allarr[i].detaillink,"jujilist"));
                templateB=templateB.replace("{name}",allarr[i].name);
                templateB=templateB.replace("{image}",getImgSrc34(allarr[i].image));
                templateB=templateB.replace("{status}",allarr[i].status);
                htmlbottom.push(templateB);
            }
            vr.$("jujilist").html(htmlbottom.join(""));
        }


        function initTitleAndQuery() {
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
                '电视剧':'http://m.v.sogou.com/teleplay/list/'
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
                    vr.$("selectType").hide();
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
                        '70年代':'1970',
                        '更早':'更早'
                    };
                    href += '+year-'+encodeURIComponent(year2Obj[queryObj["year2"]]) ;
                }
                if(queryObj["actor"]!=undefined||queryObj["director"]!=undefined||queryObj["actordirector"]!=undefined){
                    href += '+starring-'+encodeURIComponent(queryObj["actor"]||queryObj["director"]||queryObj["actordirector"]);
                }
            }
            $tvseriesTitle.attr('href', vr.getURL(href+'.html'));
        }
        function initSelectTab() {//初始化类别
            selectTypes.forEach(function (item, i) {
                if (~item.name.indexOf("year")) {
                    item.data.forEach(function (subitem, j) {
                        vr.$("year").append('<a href="javascript:void(0);">' + subitem + '</a>');
                    });
                } else {
                    item.data.forEach(function (subitem, j) {
                        vr.$(item.name).append('<a href="javascript:void(0);">' + subitem + '</a>');
                    });
                }
            });

            if (userQuery.indexOf("最新")!=-1) {
                vr.$("sort").find('a').removeClass("active").eq(1).addClass("active");
                sort="3::desc";
                loadNewList(1,true);
            }
            vr.$("sort").children().click(function(){
                if($(this).hasClass("active")){
                    return;
                }
                $(this).addClass("active").siblings().removeClass("active");
                var ss=$.trim($(this).html());
                if(ss=="最热")sort="2::desc||1::desc";
                if(ss=="最新")sort="3::desc";
                loadNewList(activeErpage);
            });
            initShuaxuanClick("type");
            initShuaxuanClick("area");
            initShuaxuanClick("year");
        }
        function initShuaxuanClick(sname){
            if(vr.$(sname).length>0){
                vr.$(sname).children().click(function(){
                    $(this).addClass("active").siblings().removeClass("active");
                    var ss=$.trim($(this).html());
                    if(sname=="year"){
                        if (isNaN(ss)) {
                            queryObj['year2'] = ss;
                            queryObj['year1'] = '';
                        } else {
                            queryObj['year1'] = ss;
                            queryObj['year2'] = '';
                        }
                    }else{
                        queryObj[sname] = ss;
                    }
                    loadNewList(activeErpage);
                });
            }
        }

        function init(){
            //这里编写你相关的业务逻辑
            initTitleAndQuery();
            initSelectTab();
            initDataJuji();
            onHandleHeader();
            Swiper($vr.find(".img-srcoll")[0],{
                auto: 1500,
                continuous: true,
                disableScroll: false,
                stopPropagation: true,
                callback: function (index) {
                    $vr.find('.box-toggle i').eq(index % ($vr.find('.box-toggle i').length)).addClass("active").siblings("i").removeClass("active");
                }
            });
            initMoreClick();
            initErPage();
        }

        function initMoreClick(){
            $vr.find(".line-whole").click(function(e){
                e.preventDefault();
                wScroll = window.scrollY;
                hashInit({
                    page: 'jujipage'
                });
            });
            vr.$("selectType").children().click(function(e){
                e.preventDefault();
                wScroll = window.scrollY;
                var txt=$.trim($(this).text());
                if(txt =="更多"){
                    hashInit({
                        page: 'jujipage'
                    });
                }else{
                    hashInit({
                        page: 'jujipage',
                        tab: txt
                    });
                }
            });

            vr.$("tj").find(".resultLink").click(function(){
                wScroll = window.scrollY;
                hashInit({
                    page: 'tuijianpage'
                });
            });
            spinit();
        }

        function spinit(){
            $('body').append($erPage);
            //$erPage.show();

            hashChange();

            window.addEventListener('hashchange', hashChange);
        }

        function getHashParam(param) {
            var hash = window.location.hash.replace(/^#subpage=/, '');
            var result = null;
            if (hash == '') {
                return result;
            }
            var paramarr = hash.split(',');

            paramarr.forEach(function(item) {
                var keyvalue = item.split('|');
                if (keyvalue[0] == param) {
                    result = keyvalue[1] == null ? null : keyvalue[1];
                }
            });

            return result;
        }

        function hashInit(param) {
            var paramarr = [];
            if (param == null) {
                window.location.hash = '';
            } else {
                for (var key in param) {
                    paramarr.push(key + '|' + param[key]);
                }
            }
            window.location.hash = 'subpage='+paramarr.join(',');
        }

        function hashChange() {
            var page = getHashParam('page');
            var tab = getHashParam('tab')||"";
            if (page == 'jujipage') {//跳转到二级页全部聚集tab
                hideBody();
                $erPage.find(".tab-info ul li").eq(0).addClass("active").siblings("li").removeClass("active");
                vr.$("er1").show();
                vr.$("er2").hide();
                if(tab){
                    if(tab=="美剧")queryObj["area"]="美国";
                    if(tab=="韩剧")queryObj["area"]="韩国";
                    if(tab=="日剧")queryObj["area"]="日本";
                    if(tab=="港剧")queryObj["area"]="香港";

                    vr.$("area").children().each(function(){
                        if($.trim($(this).html())==queryObj["area"]){
                            $(this).addClass("active").siblings().removeClass("active");
                            return;
                        }
                    });
                    loadNewList(1);
                }else{
                    queryObj["area"]="";
                    vr.$("area").find("a").eq(0).addClass("active").siblings().removeClass("active");
                    loadNewList(1);
                }
                vr.$("er1").find(".tv-list img").each(function(){
                    if($(this).data("src")){
                        $(this).attr("src",getImgSrc34($(this).data("src")));
                    }
                });

                $erPage.show();
                activeErpage=1;
                window.scrollTo(0, 0);
            } else if(page=='tuijianpage'){//跳转二级页推荐tab
                hideBody();
                $erPage.find(".tab-info ul li").eq(1).addClass("active").siblings("li").removeClass("active");
                vr.$("er1").hide();
                vr.$("er2").show();
                vr.$("er2").find(".list-img-flex img").each(function(){
                    if($(this).data("src")) {
                        $(this).attr("src", getImgSrc($(this).data("src"), imgWidth));
                    }
                });
                $erPage.show();
                activeErpage=2;
                window.scrollTo(0, 0);
            }else{
                showBody();
                $erPage.hide();
                window.scrollTo(0, wScroll);
                activeErpage=0;
            }
        }

        function hideBody() {
            var children = document.body.children;
            var child;
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                if (child.tagName != 'STYLE' && child.tagName != 'SCRIPT') {
                    if (oncehide === false) {
                        dis.push({
                            e: child,
                            display: css(child, 'display')
                        });
                    }
                    css(child, 'display', 'none');
                }
            }
            oncehide = true;
        }

        function showBody() {
            var child;
            for (var i = 0; i < dis.length; i++) {
                child = dis[i];
                css(child.e, 'display', child.display);
            }
        }

        function css(e, property, value) {
            if (undefined != value) {
                e.style[property] = value;
            } else {
                return e.style[property];
            }
        }
        //　使用方法：setCookie('username','Darren',30)
        function setCookie(c_name, value, expiredays){
     　　　　var exdate=new Date();
     　　　　exdate.setDate(exdate.getDate() + expiredays);
     　　　　document.cookie=c_name+ "=" + encodeURIComponent(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
     　　}

        function getCookie(c_name){
            //先查询cookie是否为空，为空就return ""
            if (document.cookie.length>0){
                //通过String对象的indexOf()来检查这个cookie是否存在，不存在就为 -1　　
                var c_start=document.cookie.indexOf(c_name + "=");
                    if (c_start!=-1){
                    //最后这个+1其实就是表示"="号啦，这样就获取到了cookie值的开始位置
                    c_start=c_start + c_name.length+1;
                    var c_end=document.cookie.indexOf(";",c_start);
                    if (c_end==-1) c_end=document.cookie.length;
                    return decodeURIComponent(document.cookie.substring(c_start,c_end));
                }
            }
            return "";
        }
        //初始化二级页内相关交互
        function initErPage(){
            $erPage.find(".page-back").click(function(){
                window.history.back();
            });
            $erPage.find(".tab-info ul li").each(function(i,elem){
                $(elem).click(function(){
                    $(this).addClass("active").siblings().removeClass("active");
                    if(i==0){
                        vr.$("er1").show();
                        vr.$("er2").hide();
                        vr.$("er1").find(".tv-list img").each(function(){
                            if($(this).data("src")){
                                $(this).attr("src",getImgSrc34($(this).data("src")));
                            }
                        });
                        activeErpage=1;
                        window.scrollTo(0,scroller1?scroller1:0);
                    }else{
                        vr.$("er1").hide();
                        vr.$("er2").show();
                        vr.$("er2").find(".list-img-flex img").each(function(){
                            if($(this).data("src")) {
                                $(this).attr("src", getImgSrc($(this).data("src"), imgWidth));
                            }
                        });
                        activeErpage=2;
                        window.scrollTo(0,scroller2?scroller2:0);
                    }
                });
            });
            var initshaixuanwidth=function(elem){
                var twidth=0;
                elem.find("a").each(function(){
                    twidth+=($(this).width()+Number($(this).css("margin-right").replace("px","")));
                });
                elem.css("width",twidth+19);
            }
            $erPage.find(".tv-sort-final").click(function(){
                $(this).hide();
                vr.$("shaixuan").show();
                initshaixuanwidth(vr.$("type"));
                initshaixuanwidth(vr.$("area"));
                initshaixuanwidth(vr.$("year"));
            });


            $(window).scroll(function(){
                var scrollTop = systemScrollY();
                var totalHeight = document.body.offsetHeight;
                var viewHeight = window.innerHeight;
                var canLoad = totalHeight - scrollTop - viewHeight;
                if(activeErpage==1){
                    if(scroller1>190){
                        vr.$("shaixuan").hide();
                        vr.$("er1").find(".tv-sort-final").show();
                    }
                    scroller1=scrollTop;
                }
                if(activeErpage==2)scroller2=scrollTop;
                if(activeErpage==1&&canLoad<50&&!isload1){
                    isload1=true;
                    console.info(canLoad);
                    vr.$("er1").find(".load-default").eq(0).show();
                    loadNewList(activeErpage);
                }
                if(activeErpage==2&&canLoad<50&&!isload2){
                    isload2=true;
                    vr.$("er2").find(".load-default").eq(0).show();
                    loadNewList(activeErpage);
                }
            });
        }

        function getQuery() {
            var newQuery = [];
            $.each(queryObj, function (key, value) {
                value && value != '全部' && value != '' ? newQuery.push(key + "::" + value + "::0") : '';
            });
            return newQuery.join("||");
        }
        //pageum二级页当前活动页,flag{true,需要同时加载结果也vr的列表和二级页面，false只加载二级页}
        function loadNewList(pagenum,flag){
            if(pagenum==1){
                var start = (24*fanyenum+1);
                var cnum = 24;
                if(flag){
                    start=1;
                    cnum=60;
                }
                var query=getQuery();
                var qoinfo={
                    query: query,
                    vrQuery: query,
                    classId: classId,
                    classTag: "MULTIHIT.PCTVserious.Category",
                    tplId: 70095000,
                    sortRules: sort,
                    start: start,
                    item_num: cnum,
                    pageTurn: 1,
                    queryFrom: 'wap'
                };
                onTwoReq({
                    qoInfo:qoinfo,
                    onLoadSuccess: function(list){
                        if(!flag){
                            fanyenum++;
                        }
                        showNewList(list,flag);
                    },
                    onLoadError: function(f){
                        errorHtml(f);
                    }
                });
            }else{
                var query="name::电视剧::0";
                var qoinfo2={
                    query: query,
                    vrQuery: query,
                    classId: 70125600,
                    classTag: "MULTIHIT.LEIBIE.HAOJUTUIJIAN",
                    tplId: 70125600,
                    sortRules: "2::desc||1::desc",
                    start: (10*tjnum+1),
                    item_num: 10,
                    pageTurn: 1,
                    queryFrom: 'wap'
                };
                onTwoReq({
                    qoInfo:qoinfo2,
                    onLoadSuccess: function(list){
                        tjnum++;
                        showNewList(list);
                    },
                    onLoadError: function(f){//请求成功，没有数据返回1
                        errorHtml(f);
                    }
                });
            }



        }
        function onTwoReq(option){
            var arrUrl = ["/tworeq?queryString=", encodeURIComponent(window["oldQuery"]), "&ie=utf8"];
            var key, value, arrQO = [];

            if(option && option.qoInfo){
                for(key in option.qoInfo){
                    value = option.qoInfo[key];
                    if(typeof(value) !== "undefined" && value !== null){
                        arrQO.push(key + "=" + value);
                    }
                }
                arrUrl.push("&qoInfo=", encodeURIComponent(arrQO.join("&")));
            }
            $.ajax({
                url : arrUrl.join(""),
                timeout: option.timeout || 2000,
                type : "GET",
                dataType: "xml",
                error: function(){
                    option.onLoadError && option.onLoadError();
                },
                success: function(xml){
                    try{
                        var $obj = $(xml),$data=$obj.find("item>display>subitem");
                        if($data.length == 0){
                            option.onLoadError && option.onLoadError(1);
                        } else{
                            option.onLoadSuccess && option.onLoadSuccess($data);
                        }
                    } catch (e){
                        option.onLoadError && option.onLoadError();
                        throw e
                    }
                }
            });
        }
        function getValue(item, path){
            return $.trim($(item).find(path).text()) || "";
        };
        function showNewList(list,flag){
            if(activeErpage==1){
                if(flag){
                    var newjujis=[];
                    list.forEach(function(elem,j){
                        var dis = $(elem).find("subdisplay");
                        var obj={
                            name: getValue(dis,"name"),
                            status: getValue(dis,"status"),
                            image: getValue(dis,"image"),
                            detaillink:getValue(dis,"detaillink"),
                            bigimage: getValue(dis,"bigimage"),
                            yijujieshao: getValue(dis,"yijujieshao")
                        }
                        newjujis.push(obj);
                    });
                    jujis=newjujis;
                }
                isload1=false;
                var html=[];
                var len=list.length>24?24:list.length;
                for(var i=0;i<len;i++) {
                    var item = $(list[i]).find("subdisplay");
                    var templateEa='<a style="width: 33.33%" class="item-text " href="{detaillink}">\
                        <div style="padding-bottom: 133%" class="img-tag img-height">\
                            <img alt="" src="{image}">\
                        </div>\
                        <h4 class="item-title">{name}</h4>\
                        <time class="item-time">{status}</time>\
                    </a>';
                    templateEa=templateEa.replace("{detaillink}",vr.getURL(getValue(item,"detaillink"),"erjuji"));
                    templateEa=templateEa.replace("{image}",getImgSrc34(getValue(item,"image")));
                    templateEa=templateEa.replace("{name}",getValue(item,"name"));
                    templateEa=templateEa.replace("{status}",getValue(item,"status"));
                    html.push(templateEa);
                }

                if(!flag){
                    vr.$("er1").find(".load-default").eq(0).hide();
                    vr.$("er1").find(".tv-list .item-list").append(html.join(""));
                }else{
                    vr.$("er1").find(".tv-list .item-list").html(html.join(""));
                }

            }else{
                isload2=false;
                var html2=[];
                for(var i=0;i<list.length;i++) {
                    var item = $(list[i]).find("subdisplay");

                    var templateEl='<div class="space-default">\
                        <a href="{url}" class="img-flex">\
                            <div class="img-layout">\
                                <i class="img-height"><img src="{image}" alt=""/></i>\
                            </div>\
                            <div class="text-layout">\
                                <p class="clamp2">{title}</p>\
                                <time class="space-txt">{source} {time}</time>\
                            </div>\
                        </a>\
                    </div>';
                    templateEl=templateEl.replace("{url}",vr.getURL(getValue(item,"url"),"ertj"));
                    templateEl=templateEl.replace("{image}",getImgSrc(getValue(item,"img"),imgWidth));
                    templateEl=templateEl.replace("{title}",getValue(item,"title"));
                    templateEl=templateEl.replace("{source}",getValue(item,"source"));
                    templateEl=templateEl.replace("{time}",getValue(item,"time"));
                    html2.push(templateEl);
                }
                vr.$("er2").find(".load-default").eq(0).hide();
                vr.$("er2").find(".list-img-flex").append(html2.join(""));
            }

        }

        function errorHtml(flag){
            var $er;
            if(activeErpage==1){
                $er=vr.$("er1");
            }else{
                $er=vr.$("er2");
            }
            $er.find(".load-default").eq(0).hide();
            if(flag){
                $er.find(".load-default").eq(1).html("已加载全部数据").show().unbind("click");
            }else{
                $er.find(".load-default").eq(1).html("加载失败，点击重新加载").show();
            }
        }

        vr.$("er1").find(".load-default").eq(1).click(function(){
            $(this).hide().siblings(".load-default").show();
            loadNewList(activeErpage);
        });
        vr.$("er2").find(".load-default").eq(1).click(function(){
            $(this).hide().siblings(".load-default").show();
            loadNewList(activeErpage);
        });

        if(rank > 5){
            $(function(){
                init();
            });
        }
        else{
            setTimeout(function(){
                init();
            }, 10);
        }
    };
});

