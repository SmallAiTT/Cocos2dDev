/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-9-8
 * Time: 下午10:48
 * To change this template use File | Settings | File Templates.
 */

tt.HomeLayer = cc.Layer.extend({
    className : 'tt_HomeLayer',
    btnBar : null,
    init : function(){
        this._super();

        this.btnBar = tt.BtnBar.create({
            bg : Res.background_014_png,
            btnInfos : [
                {btns : [Res.button_062_png], pos : {x : 50, y : 40}},
                {btns : [Res.button_064_png], pos : {x : 130, y : 40}},
                {btns : [Res.button_065_png], pos : {x : 210, y : 40}},
                {btns : [Res.button_063_png], pos : {x : 290, y : 40}},
                {btns : [Res.button_066_png], pos : {x : 370, y : 40}},
                {btns : [Res.button_067_png], pos : {x : 440, y : 40}}
            ]
        });
        this.addChild(this.btnBar);
        var btnBarSize = this.btnBar.getContentSize();
        this.btnBar.setPosition(tt.WIN_SIZE.width/2, btnBarSize.height/2);
//        this.setIsCacheNode(true);
        return true;
    }
});

tt.HomeLayer.create = function(args){
    var layer = new tt.HomeLayer();
    return layer.init() ? layer : null;
};
