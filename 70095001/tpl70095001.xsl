<?xml version="1.0" encoding="GBK"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="common5.4.xsl"/>
    <xsl:output method="html" version="1.0" encoding="GBK" standalone="yes"/>
    <xsl:variable name="root" select="/DOCUMENT/item/display/subitem[position()=1]/subdisplay" />
    <xsl:variable name="items" select="/DOCUMENT/item/display/subitem" />
    <xsl:variable name="tjs" select="/DOCUMENT/item/display/itdocs/sub_doc/sub_item[1]/sub_display/subitem" /><!--子vr，好剧推荐-->
    <xsl:variable name="query" select="/DOCUMENT/item/qoinfo/@query" />
    <xsl:template match="/">
        <xsl:call-template name="css" />
        <div class="vrResult">
            <xsl:attribute name="id">sogou_vr_<xsl:value-of select="/DOCUMENT/item/classid"/>_${i}</xsl:attribute>
            <xsl:call-template name="main" />
        </div>
        <xsl:if test="$tjs">
            <div class="vrResult">
                <xsl:attribute name="id">sogou_vr_<xsl:value-of select="/DOCUMENT/item/classid"/>_tj_${i}</xsl:attribute>
                <xsl:call-template name="tuijian" />
            </div>
        </xsl:if>
        <xsl:call-template name="js_b" />
    </xsl:template>
    <xsl:template name="main">
        <h3 class="vr-tit">
            <a style="display:none;" href="#" class="resultLink">
                <xsl:attribute name="id">sogou_vr_<xsl:value-of select="DOCUMENT/item/classid"/>_tvseriesTitle_${i}</xsl:attribute>
            </a>
        </h3>
        <div class="vr-tv171010">
            <div class="big-img special negative">
                <div class="img-srcoll">
                    <div class="img-list" style="width: 300%;">
                        <xsl:attribute name="id">sogou_vr_<xsl:value-of select="/DOCUMENT/item/classid"/>_lunbo_${i}</xsl:attribute>
                        <!--<a href="#" class="image">-->
                            <!--<img src="" alt=""/>-->
                            <!--<i></i>-->
                            <!--<div class="mask"></div>-->
                            <!--<div class="content">-->
                                <!--<h4 class="ellipsis">无证之罪（更至24集）</h4>-->
                                <!--<p class="ellipsis">王大陆金晨再探霸王冢，神秘人助攻解锁王大陆金晨再探霸王冢，神秘人助攻解锁</p>-->
                            <!--</div>-->
                        <!--</a>-->
                    </div>
                </div>
                <div class="box-toggle toggle-center">
                    <!--<i></i>-->
                </div>
                <!-- box-toggle over -->
            </div>
            <div class="keywords">
                <xsl:attribute name="id">sogou_vr_<xsl:value-of select="/DOCUMENT/item/classid"/>_selectType_${i}</xsl:attribute>
                <a href="javascript:void(0);">美剧</a>
                <a href="javascript:void(0);">韩剧</a>
                <a href="javascript:void(0);">日剧</a>
                <a href="javascript:void(0);">港剧</a>
                <a href="javascript:void(0);">更多</a>
            </div>
            <div class="tv-list">
                <div class="scroll-layout scroll-layout-column">
                    <div class="item-list">
                        <xsl:attribute name="id">sogou_vr_<xsl:value-of select="/DOCUMENT/item/classid"/>_jujilist_${i}</xsl:attribute>
                    </div>
                </div>
                <div class="more-box-new border-top">
                    <a href="javascript:void(0);" class="line-whole">查看更多</a>
                </div>
                <!-- more-box over -->
            </div>
        </div>

        <div class="page-fixed page-has-tab vr-tv171010" style="display:none;">
            <xsl:attribute name="id">sogou_vr_<xsl:value-of select="/DOCUMENT/item/classid"/>_erpage_${i}</xsl:attribute>
            <div class="page-header">
                <h4 class="page-title">电视剧<i class="page-back"></i></h4>
                <div class="tab-info for-two negative">
                    <ul>
                        <li>全部剧集</li>
                        <li>好剧推荐</li>
                    </ul>
                </div>
            </div>
            <div style="display:none">
                <xsl:attribute name="id">sogou_vr_<xsl:value-of select="/DOCUMENT/item/classid"/>_er1_${i}</xsl:attribute>
                <div class="tv-sort-final" position="">
                    <p class="space-txt">筛选：
                        <span class="item">最热</span>
                        <span class="item">类型</span>
                        <span class="item">地区</span>
                        <span class="last-item">年代</span>
                    </p>
                </div>
                <div class="vrMargin" style="display:none;">
                    <xsl:attribute name="id">sogou_vr_<xsl:value-of select="/DOCUMENT/item/classid"/>_shaixuan_${i}</xsl:attribute>
                    <div class="tv-sort negative">
                        <div style="overflow: hidden;">
                            <div class="scroll-sort srcoll-sort-alone">
                                <div class="item-list">
                                    <xsl:attribute name="id">sogou_vr_<xsl:value-of select="/DOCUMENT/item/classid"/>_sort_${i}</xsl:attribute>
                                    <a href="javascript:void(0);" class="active">最热</a>
                                    <a href="javascript:void(0);">最新</a>
                                </div>
                            </div>
                        </div>
                        <xsl:if test="not(contains($query,'type'))">
                            <div style="overflow: hidden;">
                                <div class="scroll-sort srcoll-sort-alone">
                                    <div class="item-list" style="width:1000px;">
                                        <xsl:attribute name="id">sogou_vr_<xsl:value-of select="/DOCUMENT/item/classid"/>_type_${i}</xsl:attribute>
                                        <a href="javascript:void(0);" class="active">全部</a>
                                    </div>
                                </div>
                            </div>
                        </xsl:if>
                        <xsl:if test="not(contains($query,'area') or contains($query,'leixing') or contains($query,'actor') or contains($query,'actordirector') or contains($query,'director'))">
                            <div style="overflow: hidden;">
                                <div class="scroll-sort srcoll-sort-alone">
                                    <div class="item-list" style="width: 1000px;">
                                        <xsl:attribute name="id">sogou_vr_<xsl:value-of select="/DOCUMENT/item/classid"/>_area_${i}</xsl:attribute>
                                        <a href="javascript:void(0);" class="active">全部</a>
                                    </div>
                                </div>
                            </div>
                        </xsl:if>
                        <xsl:if test="not(contains($query,'year1') or contains($query,'year2'))">
                            <div style="overflow: hidden;">
                                <div class="scroll-sort srcoll-sort-alone">
                                    <div class="item-list" style="width: 1000px;">
                                        <xsl:attribute name="id">sogou_vr_<xsl:value-of select="/DOCUMENT/item/classid"/>_year_${i}</xsl:attribute>
                                        <a href="javascript:void(0);" class="active">全部</a>
                                    </div>
                                </div>
                            </div>
                        </xsl:if>
                    </div>
                </div>
                <div class="tv-list vrMargin">
                    <div class="scroll-layout scroll-layout-column">
                        <div class="item-list">
                            <xsl:for-each select="$items[position()&lt;25]">
                                <a href="" class="item-text " style="width: 33.33%">
                                    <div class="img-tag img-height" style="padding-bottom: 133%">
                                        <img alt="">
                                            <xsl:attribute name="data-src"><xsl:value-of select="subdisplay/image"/></xsl:attribute>
                                        </img>
                                    </div>
                                    <h4 class="item-title"><xsl:value-of select="subdisplay/name"/></h4>
                                    <time class="item-time"><xsl:value-of select="subdisplay/status"/></time>
                                </a>
                            </xsl:for-each>
                        </div>
                    </div>
                </div>
                <div class="load-default" style="display:none">加载中</div>
                <div class="load-default load-error" style="display:none">加载失败，点击重新加载</div>
            </div>
            <div style="display:none">
                <xsl:attribute name="id">sogou_vr_<xsl:value-of select="/DOCUMENT/item/classid"/>_er2_${i}</xsl:attribute>
                <div class="list-img-flex">
                    <xsl:for-each select="$tjs">
                        <div class="space-default">
                            <a class="img-flex">
                                <xsl:call-template name="getURL">
                                    <xsl:with-param name="url" select="subdisplay/url"/>
                                    <xsl:with-param name="wml" select="1"/>
                                    <xsl:with-param name="linkid" select="'ertj'"/>
                                </xsl:call-template>
                                <div class="img-layout">
                                    <i class="img-height">
                                        <img data-src="{subdisplay/img}" alt=""/>
                                    </i>
                                </div>
                                <!-- img-layout over -->
                                <div class="text-layout">
                                    <p class="clamp2"><xsl:value-of select="subdisplay/title"/></p>
                                    <time class="space-txt">
                                        <xsl:value-of select="subdisplay/source"/>
                                        <xsl:value-of select="subdisplay/time"/>
                                    </time>
                                </div>
                                <!-- text-layout over -->
                            </a>
                        </div>
                    </xsl:for-each>
                </div>
                <div class="load-default" style="display:none">加载中</div>
                <div class="load-default load-error" style="display:none">加载失败，点击重新加载</div>
            </div>

        </div>
    </xsl:template>
    <xsl:template name="tuijian">
        <div class="vr-tv171010">
            <h3 class="vr-tit ">
                <span class="resultLink">值得看的好剧</span>
            </h3>
            <!-- vr-tit over -->
            <div class="dynamic-hidden negative">
                <div class="dynamic-layout">
                    <div class="dynamic-flex-list">
                        <xsl:attribute name="style">width:<xsl:value-of select="count($tjs)*100-60"/>%</xsl:attribute>
                        <!-- $('.dynamic-flex-list').width = $('.img-flex').length * 100% - 60% -->
                        <xsl:for-each select="$tjs">
                            <a class="img-flex">
                                <xsl:call-template name="getURL">
                                    <xsl:with-param name="url" select="subdisplay/url"/>
                                    <xsl:with-param name="wml" select="1"/>
                                    <xsl:with-param name="linkid" select="concat('tj',position())"/>
                                </xsl:call-template>
                                <div class="img-layout">
                                    <i class="img-height" style="padding-bottom: 100%">
                                        <img alt="">
                                            <xsl:attribute name="src"><![CDATA[http://img01.sogoucdn.com/v2/thumb/resize/h/150/crop/w/150/h/150?appid=200658&url=]]><xsl:value-of select="URLEncoder.encode(subdisplay/img,'UTF-8')"/></xsl:attribute>
                                        </img>
                                    </i>
                                </div>
                                <!-- img-layout over -->
                                <div class="text-layout">
                                    <h4 class="clamp2"><xsl:value-of select="subdisplay/title"/></h4>
                                    <cite class="time-from">
                                        <time><xsl:value-of select="subdisplay/time"/></time>
                                        <span><xsl:value-of select="subdisplay/source"/></span>
                                    </cite>
                                </div>
                                <!-- text-layout over -->
                            </a>
                        </xsl:for-each>
                    </div>
                    <!-- dynamic-flex-list over -->
                </div>
                <!-- dynamic-layout over -->
            </div>
        </div>
    </xsl:template>
    <xsl:template name="title"/>
    <xsl:template name="showurl"/>
    <xsl:template name="css">
        <link href="http://10.134.81.191/cdn_wap_dev/css/vr/vr_tv171010.css" rel="stylesheet" type="text/css" />
    </xsl:template>
    <xsl:template name="js_b">
        <script type="text/javascript" src="http://10.134.81.191/cdn_wap_dev/js/vr.swiper.js"></script>
        <script type="text/javascript" src="http://10.134.81.191/cdn_wap_dev/js/70095001.js"></script>
        <script type="text/javascript">
            require(['tpl70095001'], function (vr) {
                var jujis=[
                <xsl:for-each select="$items">
                    <xsl:if test="position()!=1">
                        ,
                    </xsl:if>
                    {
                        name:'<xsl:value-of select="subdisplay/name"/>'||'',
                        status:'<xsl:value-of select="subdisplay/status"/>'||'',
                        image:'<xsl:value-of select="subdisplay/image"/>'||'',
                        detaillink:'<xsl:value-of select="subdisplay/detaillink"/>'||'',
                        bigimage:'<xsl:value-of select="subdisplay/bigimage"/>'||'',
                        yijujieshao:'<xsl:value-of select="subdisplay/yijujieshao"/>'||''
                    }
                </xsl:for-each>

                ]
                vr('<xsl:value-of select="/DOCUMENT/item/classid" />', '${i}', '${t}',jujis,'${vrselect}','<xsl:value-of
                select="/DOCUMENT/item/qoinfo/@vrQuery"/>');
            },window.sogou&amp;&amp;window.sogou.vr&amp;&amp;window.sogou.vr.makeModuleLog&amp;&amp;window.sogou.vr.makeModuleLog('<xsl:value-of select="/DOCUMENT/item/classid"/>'));
        </script>
    </xsl:template>
</xsl:stylesheet>