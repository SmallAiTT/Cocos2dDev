/**
 * Created with JetBrains WebStorm.
 * User: small
 * Date: 13-9-3
 * Time: 上午11:54
 * To change this template use File | Settings | File Templates.
 */

tt.HeroListLayer = cc.Layer.extend({
    className : 'tt_HeroListLayer',
    _viewSize : null,

    setViewSize : function(w, h){
        if(w != null && h != null){
            this._viewSize = cc.size(w, h);
        } else if(w != null){
            this._viewSize = w;
        }
    },
    getViewSize : function(){
        return this._viewSize;
    },
    init : function(){
        this._super();

        var tableView = cc.TableView.create(this, this._viewSize);
        tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        tableView.setDelegate(this);
        this.addChild(tableView);
        tableView.reloadData();
        return true;
    },


    scrollViewDidScroll:function (view) {
    },
    scrollViewDidZoom:function (view) {
    },

    tableCellTouched:function (table, cell) {
        cc.log("cell touched at index: " + cell.getIdx());
    },

    cellSizeForTable:function (table) {
        return cc.size(450, 110);
    },

    tableCellAtIndex:function (table, idx) {
        table.setTouchPriority(-10000);
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        var label;
        if (!cell) {
            cell = new cc.TableViewCell();
            var item = tt.HeroListItem.create();
//            var item = cc.Sprite.create(Res.background_022_png);
            item.setAnchorPoint(tt.ANCHOR_POINT_BL);
            cell.addChild(item);
        } else {
//            label = cell.getChildByTag(123);
//            label.setString(strValue);
        }

        return cell;
    },

    numberOfCellsInTableView:function (table) {
        return 20;
    }
});

tt.HeroListLayer.create = function(args){
    var layer = new tt.HeroListLayer();
    layer.setViewSize(args.viewSize || tt.WIN_SIZE);
    return layer.init() ? layer : null;
};
