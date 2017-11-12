<?xml version="1.0" encoding="GBK"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:mspider="http://exslt.org/mspider"
                extension-element-prefixes="mspider">
  <xsl:import href="common5.4.xsl"/>
  <xsl:output method="html" version="1.0" encoding="GBK" standalone="yes"/>

  <xsl:template name="title" />
  <xsl:template name="showurl" />

  <xsl:variable name="query" select="//qoinfo/@query" />
  <xsl:variable name="itemCnt" select="count(//display/subitem)" />
  <xsl:variable name="tag" select="//display/subitem[1]/subdisplay/tag" />
  <xsl:template name="main">
    <h3 class="vr-tit">
      <a href="javascript:void(0)" class="resultLink">
        <xsl:call-template name="id">
        <xsl:with-param name="value" select="'tvseriesTitle'" />
      </xsl:call-template>
        <xsl:choose>
          <xsl:when test="contains($tag, ';')">
            <xsl:value-of select="substring-before($tag, ';')"/>大全</xsl:when>
          <xsl:otherwise><xsl:value-of select="$tag"/>大全</xsl:otherwise>
        </xsl:choose>
      </a>
    </h3>
    <div class="vr-teleplay160815">
      <xsl:call-template name="id">
        <xsl:with-param name="value" select="'tvseries'" />
      </xsl:call-template>
      <div class="box-select select-layout-more tv-select" style="z-index: 10;">
        <xsl:call-template name="id">
          <xsl:with-param name="value" select="'tvseriesSelectTab'" />
        </xsl:call-template>
        <div class="select-layout" style="width:auto;">
          <p class="select-text" data-show="no" chooseText="最热">最热</p>
          <span class="btn-select"></span>
        </div>
        <xsl:if test="not(contains($query,'type'))">
          <div class="select-layout" style="width:auto;">
            <p class="select-text" data-show="no" chooseText="类型">类型</p>
            <span class="btn-select"></span>
          </div>
        </xsl:if>
        <xsl:if test="not(contains($query,'area') or contains($query,'leixing') or contains($query,'actor') or contains($query,'actordirector') or contains($query,'director'))">
          <div class="select-layout" style="width:auto;">
            <p class="select-text" data-show="no" chooseText="地区">地区</p>
            <span class="btn-select"></span>
          </div>
        </xsl:if>
        <xsl:if test="not(contains($tag, '综艺') or contains($tag, '动漫') or contains($query,'year1') or contains($query,'year2'))">
          <div class="select-layout" style="width:auto;">
            <p class="select-text" data-show="no" chooseText="年代">年代</p>
            <span class="btn-select"></span>
          </div>
        </xsl:if>
        <div class="select-level-option" typeList="最热">
           <div class="select-option">
            <ol class="option-list">
              <li class="active" data-content="最热">最热</li>
              <li>最新</li>
              <xsl:if test="contains($tag, '电影')"><li>好评</li></xsl:if>
            </ol>
           </div>
        </div>
        <xsl:if test="not(contains($query,'type'))">
          <div class="select-level-option" typeList="类型">
            <div class="select-option _tvseries_type" data-type="type">
              <ol class="option-list">
                <li data-content="类型">全部</li>
              </ol>
            </div>
          </div>
        </xsl:if>
        <xsl:if test="not(contains($query,'area') or contains($query,'actor') or contains($query,'actordirector') or contains($query,'director'))">
          <div class="select-level-option" typeList="地区">
            <div class="select-option _tvseries_area" data-type="area">
              <ol class="option-list">
                <li data-content="地区">全部</li>
              </ol>
            </div>
          </div>
        </xsl:if>
        <xsl:if test="not(contains($tag, '综艺') or contains($tag, '动漫') or contains($query,'year1') or contains($query,'year2'))">
          <div class="select-level-option" typeList="年代">
            <div class="select-option _tvseries_year" data-type="year">
              <ol class="option-list">
                <li data-content="年代">全部</li>
              </ol>
            </div>
          </div>
        </xsl:if>
      </div>
      <div class="load-default load-error _tvseries_loading" style="display:none;">
        <p class="load-default"><i class="keyframes-loading"></i>正在加载...</p>
      </div>
      <div class="load-default load-error _tvseries_error" style="display:none;">
        <span class="fail">加载失败，点击重试~</span>
      </div>
      <div class="load-default load-error no-result _tvseries_noresult" style="display:none;">筛选无结果，试试其它条件吧！</div>
      <div class="video-box">
        <xsl:call-template name="id">
          <xsl:with-param name="value" select="'tvseriesList'" />
        </xsl:call-template>
        <xsl:call-template name="videoList"></xsl:call-template>
      </div>
    </div>
    <a href="javascript:void(0);" class="slide-down border-top _tvseries_show">
      <xsl:if test="$itemCnt &lt; 9">
        <xsl:attribute name="style">display:none;</xsl:attribute>
      </xsl:if>展开更多</a>
    <a href="javascript:void(0);" class="slide-down border-top slide-up" style="display:none;">收起</a>
  </xsl:template>

  <xsl:template name="videoList">
    <xsl:for-each select="//display/subitem[position() mod 8 = 1]">
      <xsl:variable name="pos" select="position()" />
      <xsl:variable name="start" select="($pos - 1) * 8" />
      <div class="tv-list">
        <xsl:if test="$pos != 1">
          <xsl:attribute name="style">display:none;padding-top:0px;</xsl:attribute>
        </xsl:if>
        <div class="scroll-layout scroll-layout-default">
          <div class="item-list">
          <xsl:for-each select="//display/subitem[position() &gt; $start and position() &lt; $start + 5]">
            <a class="item-text">
                <xsl:call-template name="getURL">
                  <xsl:with-param name="url" select="subdisplay/detaillink"/>
                  <xsl:with-param name="wml" select="1"/>
                  <xsl:with-param name="linkid" select="'tv'"/>
                </xsl:call-template>
                <div class="img-tag">
                  <img alt="" style="background-size: cover; background-repeat: no-repeat;" class="pic-box">
                    <xsl:attribute name="data-src">
                      <xsl:value-of select="subdisplay/image"/>
                    </xsl:attribute>
                  </img>
                   <xsl:choose>
                      <xsl:when test="contains($tag, '电影')">
                        <xsl:if test="(subdisplay/year1 != '' and subdisplay/year1 != 0) or (subdisplay/score != 0 and subdisplay/score != 0.0)">
                          <p class="about-img about-img-text">
                            <xsl:if test="subdisplay/year1 != '' and subdisplay/year1 != 0">
                              <span class="about-date"><xsl:value-of select="subdisplay/year1"/></span>
                            </xsl:if>
                            <xsl:if test="subdisplay/score != 0 and subdisplay/score != 0.0">
                              <span class="about-score"><xsl:value-of select="subdisplay/score"/>分</span>
                            </xsl:if>
                          </p>
                        </xsl:if>
                        <!--<xsl:if test="subdisplay/hotshow and subdisplay/hotshow = '1'">
                          <span class="hot">热映</span>
                        </xsl:if>-->
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:if test="subdisplay/status != ''">
                          <p class = "about-img" style="overflow: hidden;">
                              <xsl:value-of select="subdisplay/status"/>
                          </p>
                        </xsl:if>
                      </xsl:otherwise>
                  </xsl:choose>
                </div>
                <h4 class="item-title align-left"><xsl:value-of select="subdisplay/name"/></h4>
            </a>
          </xsl:for-each>
          <xsl:if test="position() = last()">
            <xsl:choose>
              <xsl:when test="$itemCnt mod 8 = 1">
                <div class="item-text">
                  <div class='img-tag' style='background:url()'></div>
                </div>
                <div class="item-text">
                  <div class='img-tag' style='background:url()'></div>
                </div>
                <div class="item-text">
                  <div class='img-tag' style='background:url()'></div>
                </div>
              </xsl:when>
              <xsl:when test="$itemCnt mod 8 = 2">
                <div class="item-text">
                  <div class='img-tag' style='background:url()'></div>
                </div>
                <div class="item-text">
                  <div class='img-tag' style='background:url()'></div>
                </div>
              </xsl:when>
              <xsl:when test="$itemCnt mod 8 = 3">
                <div class="item-text">
                  <div class='img-tag' style='background:url()'></div>
                </div>
              </xsl:when>
            </xsl:choose>
          </xsl:if>
          </div>
        </div>
        <div class="scroll-layout scroll-layout-default">
            <xsl:if test="position() = last() and ($itemCnt mod 8 &lt; 4) and not($itemCnt mod 8 = 0)">
              <xsl:attribute name="style">display:none;</xsl:attribute>
            </xsl:if>
            <div class="item-list">
              <xsl:for-each select="//display/subitem[position() &gt; $start + 4 and position() &lt; $start + 9]">
                <a class="item-text">
                  <xsl:call-template name="getURL">
                    <xsl:with-param name="url" select="subdisplay/detaillink"/>
                    <xsl:with-param name="wml" select="1"/>
                    <xsl:with-param name="linkid" select="'tv'"/>
                  </xsl:call-template>
                  <div class="img-tag">
                    <img alt="" style="background-size: cover; background-repeat: no-repeat;" class="pic-box">
                      <xsl:attribute name="data-src">
                        <xsl:value-of select="subdisplay/image"/>
                      </xsl:attribute>
                    </img>
                    <xsl:choose>
                      <xsl:when test="contains($tag, '电影')">
                        <xsl:if test="(subdisplay/year1 != '' and subdisplay/year1 != 0) or (subdisplay/score != 0 and subdisplay/score != 0.0)">
                          <p class="about-img about-img-text">
                            <xsl:if test="subdisplay/year1 != '' and subdisplay/year1 != 0">
                              <span class="about-date"><xsl:value-of select="subdisplay/year1"/></span>
                            </xsl:if>
                            <xsl:if test="subdisplay/score != 0 and subdisplay/score != 0.0">
                              <span class="about-score"><xsl:value-of select="subdisplay/score"/>分</span>
                            </xsl:if>
                          </p>
                        </xsl:if>
                        <!--<xsl:if test="subdisplay/hotshow and subdisplay/hotshow = '1'">
                          <span class="hot">热映</span>
                        </xsl:if>-->
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:if test="subdisplay/status != ''">
                          <p class = "about-img" style="overflow: hidden;">
                            <xsl:value-of select="subdisplay/status"/>
                          </p>
                        </xsl:if>
                      </xsl:otherwise>
                    </xsl:choose>
                  </div>
                  <h4 class="item-title align-left"><xsl:value-of select="subdisplay/name"/></h4>
                </a>
              </xsl:for-each>
              <xsl:if test="position() = last()">
                <xsl:choose>
                  <xsl:when test="$itemCnt mod 8 = 5">
                    <div class="item-text">
                      <div class='img-tag' style='background:url()'></div>
                    </div>
                    <div class="item-text">
                      <div class='img-tag' style='background:url()'></div>
                    </div>
                    <div class="item-text">
                      <div class='img-tag' style='background:url()'></div>
                    </div>
                  </xsl:when>
                  <xsl:when test="$itemCnt mod 8 = 6">
                    <div class="item-text">
                      <div class='img-tag' style='background:url()'></div>
                    </div>
                    <div class="item-text">
                      <div class='img-tag' style='background:url()'></div>
                    </div>
                  </xsl:when>
                  <xsl:when test="$itemCnt mod 8 = 7">
                    <div class="item-text">
                      <div class='img-tag' style='background:url()'></div>
                    </div>
                  </xsl:when>
                </xsl:choose>
              </xsl:if>
            </div>
          </div>
      </div>
    </xsl:for-each>
  </xsl:template>

  <xsl:template name="css">
    <style rel="stylesheet" grunt="http://dlweb.sogoucdn.com/wapvr/css/vr/teleplay.min.4cb5a36c.css"><![CDATA[.teleplay-fixed .scroll-layout,.vr-teleplay160815 .scroll-layout{margin-bottom:7px}.teleplay-back:before,.teleplay-top:before{font-family:iconfont!important}.vr-teleplay160815 .tv-list{margin-top:12px}.vr-teleplay160815 .select-level-option .option-list li{border:none}.teleplay-fixed{position:relative;left:0;top:0;z-index:23;background:#fff;padding:94px 19px 0}.teleplay-fixed .load-default{padding:7px 0 19px}.teleplay-fixed .no-more:before{display:none}.teleplay-fixed .tv-select{position:absolute;z-index:24;top:44px;left:19px;right:19px;bottom:auto;background:#fff}.teleplay-back,.teleplay-title{position:absolute;left:0;top:0;text-align:center}.teleplay-fixed .tv-list{margin-top:0}.teleplay-title{background:#fff;font-size:16px;height:44px;line-height:44px;right:0;z-index:24;color:#333}.teleplay-back{z-index:25;right:auto;bottom:0;width:44px}.teleplay-back:before{display:block;line-height:44px;color:#666;content:'\e664';-webkit-transform:rotate(-90deg);-ms-transform:rotate(-90deg);transform:rotate(-90deg)}.teleplay-top{position:fixed;z-index:26;left:auto;right:12px;bottom:45px;top:auto;background:rgba(255,255,255,.9);width:38px;height:38px;text-align:center;color:#fff;border-radius:50%;box-shadow:0 0 2px #bebebe}.teleplay-top:before{display:block;line-height:38px;margin:0 auto;content:'\e61a';color:#666;font-size:16px;-webkit-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}]]></style>
    <style type="text/css">
      <![CDATA[
      .scroll-layout-default .img-tag { height: 0; padding-bottom: 133%; }
      .vr-teleplay160815 .option-list li {
        float:left;
      }
      ]]>
    </style>
  </xsl:template>
  <xsl:template name="js_b">
    
    <script type="text/javascript">
      require(["http://dlweb.sogoucdn.com/wapvr/js/70095000.min.54a0bdf6.js"], function (vr) {
        vr({classId: '<xsl:value-of select="/DOCUMENT/item/classid"/>',rankId: "${i}",tcurl:"${t}",query:'<xsl:value-of select="$query"/>',selectTypes: '${vrselect}',tag: '<xsl:choose>
            <xsl:when test="contains($tag, ';')">
              <xsl:value-of select="substring-before($tag, ';')"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="$tag"/>
            </xsl:otherwise>
          </xsl:choose>'});},window.sogou&amp;&amp;window.sogou.vr&amp;&amp;window.sogou.vr.makeModuleLog&amp;&amp;window.sogou.vr.makeModuleLog('<xsl:value-of select="/DOCUMENT/item/classid"/>'));
    </script>
  </xsl:template>
  <xsl:template name="id">
    <xsl:param name="name" select="'id'"/>
    <xsl:param name="value"/>
    <xsl:attribute name="{$name}">sogou_vr_<xsl:value-of select="/DOCUMENT/item/classid"/>_<xsl:value-of select="$value"/>_${i}</xsl:attribute>
  </xsl:template>
</xsl:stylesheet>