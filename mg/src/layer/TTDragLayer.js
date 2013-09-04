/**
 * Created with JetBrains WebStorm.
 * User: small
 * Date: 13-8-12
 * Time: 上午10:37
 * To change this template use File | Settings | File Templates.
 */

tt.DragLayer = cc.Layer.extend({

    /** start position */
    _startPos : null,
    /** the pre position when dragging */
    _prePos : null,

    /** the position when sprites hide */
    _hidePos : cc.p(-1000, -1000),

    _isDraggable : true,

    ctor:function(){
        this._super();
    },

    init : function(){
        this._super();
        this._initRes();
        this.setTouchEnabled(true);
        this.setTouchPriority(-1000000);
        return true;
    },
    registerWithTouchDispatcher:function () {
        cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, this.getTouchPriority(), false);
    },

    _initRes : function(){
        //TODO override here to init your resource.
    },

    _onDragging : function(offset, touch, event){
        //TODO override here
        this.setPosition(cc.pAdd(this.getPosition(), offset));
    },

    _onDragEnded : function(touch, event){
        //TODO override here
    },

    onTouchBegan:function(touch, event) {
        if(!this._isDraggable) return;
        this._startPos = this.getPosition();
        this._prePos = touch.getLocation();
        return true;
    },
    onTouchMoved:function(touch, event) {
        if(!this._isDraggable) return;
        var pos = touch.getLocation();
        var offset = cc.pSub(pos, this._prePos);
        this._prePos = pos;
        this._onDragging(offset, touch, event);
    },
    onTouchEnded:function(touch, event) {
        if(!this._isDraggable) return;
        this._prePos = null;
        this._onDragEnded(touch, event);
        return true;
    },

    onTouchCancelled:function(touch, event) {
        if(!this._isDraggable) return;
        this._prePos = null;
        this._onDragEnded(touch, event);
        return false;
    }
});

var Ta = cc.Class.extend({
    onDidLoadFromCCB : function(){
    }
});
