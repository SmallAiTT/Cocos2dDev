/**
 * Created with JetBrains WebStorm.
 * User: small
 * Date: 13-8-29
 * Time: 上午11:59
 * To change this template use File | Settings | File Templates.
 */


tt.BtnBar = cc.Node.extend({
    _bg : null,
    _bgSp : null,

    _btnInfos : [],

    setBg : function(bg){
        this._bg = bg;
    },
    setBtnInfos : function(btnInfos){
        this._btnInfos = btnInfos;
    },
    init : function(){
        this._super();
        this._bgSp = cc.Sprite.create(this._bg);
        this.addChild(this._bgSp);
        this.setContentSize(this._bgSp.getContentSize());
        this.setAnchorPoint(tt.ANCHOR_POINT_C);
        this._bgSp.setAnchorPoint(tt.ANCHOR_POINT_BL);

        this._initBtns();

        return true;
    },

    _initBtns : function(){
        this._btnInfos.forEach(function(value, index){

            if(value.cust) return value.cust(this, value, index);

            var btnBg = cc.Scale9Sprite.create(value.btns[0]);
            var btnHlBg = cc.Scale9Sprite.create(value.btns.length > 1 ? value.btns[1] : value.btns[0]);

            var title = cc.LabelTTF.create(value.title || "", value.fnt || "Marker Felt", value.fntSize || 12);

            var button = cc.ControlButton.create(title, btnBg);
            button.setBackgroundSpriteForState(btnHlBg, cc.CONTROL_STATE_HIGHLIGHTED);
            button.setTitleColorForState(cc.WHITE, cc.CONTROL_STATE_HIGHLIGHTED);
            button.setAnchorPoint(tt.ANCHOR_POINT_C);
            button.setPreferredSize(cc.size(62, 69));
            button.setPosition(value.pos);
            window.test = button;
            this.addChild(button);
        }.bind(this));
    }
});

tt.BtnBar.create = function(args){
    var bar = new tt.BtnBar();
    bar.setBg(args.bg);
    bar.setBtnInfos(args.btnInfos);
    return bar.init() ? bar : null;
};