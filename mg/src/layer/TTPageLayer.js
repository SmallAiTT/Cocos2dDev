/**
 * Created with JetBrains WebStorm.
 * User: small
 * Date: 13-8-12
 * Time: 上午10:03
 * To change this template use File | Settings | File Templates.
 */


tt.PAGE_LAYER_ZORDER_BG = -10;
tt.PAGE_LAYER_ZORDER_MI = 10;
tt.PageLayer = tt.DragLayer.extend({
    /** size of one page */
    _pageSize : null,

    _pages : [],
    /** the info of pages */
    _pageInfos : [],
    /** current index of page */
    _currentIndex : 0,
    /** the factor of move length for x */
    _effFactor : 0.1,
    _pageMoveInterval : 0.2,

    _target : null,
    _callback : null,

    _isNextShowed : false,

    _moveDirection : 0,

    ctor : function(){
        this._super();
    },

    setPageInfos : function(pageInfos){
        this._pageInfos = pageInfos;
    },

    init : function(){
        this._super();
        this._pages = [];
        this._pageSize = cc.Director.getInstance().getWinSize();

        for(var i = 0; i < this._pageInfos.length; ++i){
            this._pages.push(null);
        }
        this.setAnchorPoint(cc.p(0, 0));
        this.showPage(this._currentIndex);

        return true;
    },

    setCurrentIndex : function(index ){
        this._currentIndex = index;
    },

    getCurrentIndex : function(){
        return this._currentIndex;
    },

    setCallBack:function(target,callback)
    {
        this._target = target;
        this._callback = callback;
    },

    /**
     * Desc:create page node for yours.
     * @param pageInfo
     * @param index
     * @returns {cc.Node}
     * @private
     */
    _createPage : function(pageInfos,index){
        //TODO override here to customize yours.
        //return the page node you create.
        var node = null
        return node;
    },

    /**
     * Desc: get or create page.
     * @param index
     * @returns {cc.Node}
     * @private
     */
    _gocPage : function(index){
        index = cc.clampf(index, 0, this._pageInfos.length - 1);
        if(this._pages[index] != null) return this._pages[index];
        var page = this._createPage(this._pageInfos[index],index);
        this._pages[index] = page;
        page.setVisible(false);
        return page;
    },

    showPage : function(index){
        index = cc.clampf(index, 0, this._pageInfos.length - 1);
        this._gocPage(index - 1);
        this._gocPage(index);
        this._gocPage(index + 1);
        this._currentIndex = index;
        this._pages[this._currentIndex].setVisible(true);
        this.setPosition(cc.p(0 - this._pageSize.width * index, 0));
    },
    _runPageMoveAct : function(index){
        index = cc.clampf(index, 0, this._pageInfos.length - 1);
        if(index == this._currentIndex && !this._isNextShowed) return;
        this._pages[index].setVisible(true);
        this._isDraggable = false; //防止移动过程中还会被拖动
        var mvTo = cc.MoveTo.create(this._pageMoveInterval, cc.p(0 - this._pageSize.width * index, 0));
        var func = cc.CallFunc.create(function(){
            this._isNextShowed = false;
            this._moveDirection = 0;
            for(var i = 0; i < this._pages.length; ++i){
                if(i != this._currentIndex && this._pages[i]) this._pages[i].setVisible(false);
            }
            this._isDraggable = true;//恢复可拖动
        }.bind(this));
        var seq = cc.Sequence.create(mvTo, func);
        this.runAction(seq);
        this._gocPage(index + (index - this._currentIndex));
        this._currentIndex = index;
        this.callBack();
    },
    runPageMoveAct : function(index){
        this._runPageMoveAct(index);
    },
    _onDragging :function(offset, touch, event){
        var pos = this.getPosition();
        if(pos.x + offset.x >= 0  || pos.x + offset.x <= -1 * this._pageSize.width * (this._pages.length - 1)) return;

        var index = -1;
        var idx = -1;
        if(pos.x  > this._startPos.x){
            index = this._currentIndex - 1;
            idx = this._currentIndex + 1;
        }else if(pos.x  < this._startPos.x){
            index = this._currentIndex + 1;
            idx = this._currentIndex - 1;
        }
        if(index >= 0 && index < this._pages.length && this._pages[index]) this._pages[index].setVisible(true);
        if(idx >= 0 && idx < this._pages.length && this._pages[idx]) this._pages[idx].setVisible(false);
        this._isNextShowed = true;
        this.setPosition(cc.p(pos.x + offset.x, 0));
    },
    _onDragEnded : function(touch, event){
        this._super(touch, event);
        var pos = this.getPosition();
        var l = this._startPos.x - pos.x;
        var index = this._currentIndex;
        if(Math.abs(l) >= this._pageSize.width * this._effFactor){
            index = l < 0 ? index - 1 : index + 1;
        }
        this._runPageMoveAct(index);
    },

    callBack:function()
    {
        if(this._target)
        {
            this._callback.apply(this._target,[this._currentIndex]);
        }
    }
});

tt.PageLayer.create = function(args){
    var layer = new tt.PageLayer();
    layer.setPageInfos(args.pageInfos);
    if(args.index != null) layer.setCurrentIndex(args.index);
    if(args.callback != null) layer.setCallBack(args.target, args.callback);
    return layer.init() ? layer : null;
}