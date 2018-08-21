(function($){
	String.prototype.TemplateFn = function() {
		var args = arguments;
		return this.replace(/\{(\d+)\}/g, function(m, i) {
			return args[i];
		});
	};


	$.fn.pmPagination = function(option) {
		//初始化数据
		option = $.extend({
			viewedIndex : 4, //一次能看到的页码数
			currentPage : 1, //当前页码
			totalPage : 10, //总共页数
			preVisible : true, //永远都显示上一页按钮，即使上一页按钮不可用
			nextVisible : true,
			gotoVisible : true,
			edgeNum : 1,
			paginationHtml : "<div class='pagination'></div>",
			canClick_pre : '<a class="prev" href="javascript:;"><b></b>上一页</a>',
			canClick_nxt : '<a class="next" href="javascript:;"> 下一页<b></b></a>',
			canClick_pre_seo : '<a class="prev" href="{0}"><b></b>上一页</a>',
			canClick_nxt_seo : '<a class="next" href="{0}"> 下一页 <b></b></a>',
			cannotClick_pre : '<span class="prev"><b></b>上一页</span>',
			cannotClick_nxt : '<span class="next"> 下一页 <b></b></span>',
			commonPageA : '<a >{0}</a>',
			commonPageA_seo : '<a href="{0}">{1}</a>',
			currPageA : '<a class="current"  style="_color:#f60;">{0}</a>',
			omitText : "<em>...</em>",
			gotoPreText : '共10页，到第',
			gotoText : '<input type="text" class="goto-index" name="gotoIndex"/>页 <a href="javascript:;" name="gotoButton" class="page-submit">确定</a>',
			callbackFn : "" //取每页的数据 ，对外接口，需调 用者自行书写
		},option || {});
		//兼容之前的分页控件
		option.currentPage = parseInt(option.currentPage);
		var containers = this,paginationUtil,paginationHtml;
		//点击页数按钮
		function callBackHandler(evt){
			var links, 
				newCurrentPage = $(evt.target).data('pageId');
			if(!newCurrentPage) {
				return;
			}
			var continuePropagation = selectPage(newCurrentPage);
			if (!continuePropagation) {
				evt.stopPropagation();
			}
			return continuePropagation;
		}
		
		function selectPage(newCurrentPage) {
			containers.data('currentPage', newCurrentPage);
			paginationHtml = paginationUtil.getPaginationHtml(newCurrentPage, callBackHandler);
			containers.empty();
			paginationHtml.appendTo(containers);
			//回调
			var continuePropagation = option.callbackFn(newCurrentPage, containers);
			return continuePropagation;
		}
		
		paginationUtil = new $.PaginationUtil(option);
		paginationHtml = paginationUtil.getPaginationHtml(option.currentPage,callBackHandler);
		this.empty();
		paginationHtml.appendTo(this);
		
	}
	
	$.PaginationUtil = function(opts) {
		$.extend(this,opts || {});
	}
	
	$.extend($.PaginationUtil.prototype,{
		getBeginAndEnd : function(currentPage) {
			var neHalf = Math.floor(this.viewedIndex / 2);
			var upperLimit = this.totalPage - this.viewedIndex;
			var begin = currentPage > neHalf ? Math.max( Math.min(currentPage - neHalf, upperLimit), 1 ) : 1;
			var end = currentPage > neHalf ?Math.min(currentPage+neHalf, this.totalPage):Math.min(this.viewedIndex, this.totalPage);
			return {begin:begin, end:end};
		},
		getPaginationHtml : function(currentPage,eventHandler) {
			var begin,end,
			    beginAndEnd = this.getBeginAndEnd(currentPage),
			    $pagination = $(this.paginationHtml);
			//生成上一页
			if(this.totalPage > 0 &&  this.preVisible) {
				$pagination.append(this.createPrePagination(currentPage - 1,currentPage));
			}
			//生成第一页和...内容
			if(beginAndEnd.begin > 1 && this.edgeNum > 0) {
				end = Math.min(this.edgeNum, beginAndEnd.begin - 1);
				this.appendRangePagination($pagination, currentPage, 1, end);
				if(this.edgeNum < (beginAndEnd.begin - 1)) {
					$(this.omitText).appendTo($pagination);
				}
			}
			//生成当前页和左右页码
			this.appendRangePagination($pagination, currentPage, beginAndEnd.begin, beginAndEnd.end);
			//生成...和右边缘
			if (beginAndEnd.end < this.totalPage && this.edgeNum > 0) {
				if(this.totalPage - this.edgeNum > beginAndEnd.end ) {
					$(this.omitText).appendTo($pagination);
				}
				begin = Math.max(this.totalPage - this.edgeNum, beginAndEnd.end);
				this.appendRangePagination($pagination, currentPage, begin + 1, this.totalPage);
			}
			//生成下一页
			if(this.totalPage > 0 && this.nextVisible){
				$pagination.append(this.createNxtPagination(currentPage + 1, currentPage));
			}
			//生成跳转样式
			if(this.totalPage > 0 && this.gotoVisible) {
				this.gotoPagination($pagination)
			}
			$('a', $pagination).click(eventHandler);
			return $pagination;
		},
		createPrePagination : function(pageId,currentPage) {
			pageId = pageId<1?1:(pageId<this.totalPage?pageId:this.totalPage);
			var preHtml;
			if(pageId == currentPage) {
				preHtml = $(this.cannotClick_pre);
			}else{
				preHtml = $(this.canClick_pre);
			}
			preHtml.data("pageId",pageId);
			return preHtml;
		},
		createNxtPagination : function(pageId,currentPage) {
			pageId = pageId<1?1:(pageId<this.totalPage?pageId:this.totalPage);
			var nxtHtml;
			if(pageId == currentPage) {
				nxtHtml = $(this.cannotClick_nxt);
			}else{
				nxtHtml = $(this.canClick_nxt);
			}
			nxtHtml.data("pageId",pageId);
			return nxtHtml;
		},
		createAnyPagination : function(pageId,currentPage) {
			pageId = pageId<1?1:(pageId<this.totalPage?pageId:this.totalPage);
			var pHtml;
			if(pageId == currentPage) {       
				var currPageA = this.currPageA.TemplateFn(pageId);
				pHtml = $(currPageA);
			}else{
				var commonPageA = this.commonPageA.TemplateFn(pageId);
				pHtml = $(commonPageA);
			}
			pHtml.data("pageId",pageId);
			return pHtml;
		},
		appendRangePagination : function(container,currentPage,begin,end) {
			for(var i=begin; i<=end; i++) {
				this.createAnyPagination(i, currentPage).appendTo(container);
			}
		},
		gotoPagination : function(container) {
			var that = this;
			container.append(this.gotoPreText);
			$(this.gotoText).appendTo(container);
			var reg = /^[1-9]{1}[0-9]*$/;
			container.find("input[name=gotoIndex]").keyup(function(evt) {
				var gotoIndex = $(evt.target).val();
				if(!reg.test(gotoIndex)) {
					$(evt.target).val("");
					return;
				}
				gotoIndex = parseInt(gotoIndex);
				if(gotoIndex > parseInt(that.totalPage)) {
					$(evt.target).val("");
					return;
				}
				container.find("a[name=gotoButton]").data("pageId",gotoIndex);
			});
		}
	})
	
})(window.jQuery);

