/**
 * Created with JetBrains WebStorm.
 * User: small
 * Date: 13-8-29
 * Time: 下午4:42
 * To change this template use File | Settings | File Templates.
 */

var ResCfg = ResCfg || {};
var tt = tt || {};
tt.cfg = ResCfg;

ResCfg[Res.TTBtnBar_js] = {
    testRes : [
        Res.background_014_png,
        Res.button_062_png,
        Res.button_064_png,
        Res.button_065_png,
        Res.button_063_png,
        Res.button_066_png,
        Res.button_067_png
    ],
    sprite : "tt.BtnBar",
    args : {
        bg : Res.background_014_png,
        btnInfos : [
            {btns : [Res.button_062_png], pos : {x : 50, y : 40}},
            {btns : [Res.button_064_png], pos : {x : 130, y : 40}},
            {btns : [Res.button_065_png], pos : {x : 210, y : 40}},
            {btns : [Res.button_063_png], pos : {x : 290, y : 40}},
            {btns : [Res.button_066_png], pos : {x : 370, y : 40}},
            {btns : [Res.button_067_png], pos : {x : 440, y : 40}}
        ]
    }
};

ResCfg["DMLoginLayer"] = {
    testRes : [
        Res.btnbg_004_1_png, Res.btnbg_004_2_png, Res.btnbg_004_3_png, Res.background_1000_png,
        Res.background_072_jpg
    ],
    testFiles : [Res.DMLoginLayer_js],
    layer : "dm.LoginLayer"
};

ResCfg[Res.TTHeroListItem_js] = {
    res : [Res.background_022_png],
    sprite : "tt.HeroListItem"
};

ResCfg[Res.TTHeroListLayer_js] = {
    ref : [Res.TTHeroListItem_js],
    layer : "tt.HeroListLayer"
};

ResCfg[Res.TTDragLayer_js] = {
    testFiles : [Res.TTDragLayerTest_js],
    testRes : [Res.background_001_png],
    layer : "dm.DragLayerTest"
};
ResCfg[Res.TTCacheLayer_js] = {
    testRes : [Res.map_background_001_jpg, Res.hero_border_1_png],
    layer : "tt.CacheLayer"
};

ResCfg[Res.TTCacheNodeTest_js] = {
    testRes : [Res.map_background_001_jpg, Res.hero_border_1_png],
    layer : "tt.CacheLayer"
};