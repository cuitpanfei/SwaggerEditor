layui.config({
    base: '../components/layui/modules/'      //自定义layui组件的目录
}).extend({ //设定组件别名
    swagger:   'swagger'
});

//格式化代码函数,已经用原生方式写好了不需要改动,直接引用就好
var formatJson = function (json) {
    var formatted = '',     //转换后的json字符串
        padIdx = 0,         //换行后是否增减PADDING的标识
        PADDING = '    ';   //4个空格符
    /**
     * 将对象转化为string
     */
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    }
    json = json.replace(/\n/g,'').replace(/[ ]+/g,'');
    /** 
     *利用正则类似将{'name':'ccy','age':18,'info':['address':'wuhan','interest':'playCards']}
     *---> \n{\n'name':'ccy',\n'age':18,\n
     *'info':\n[\n'address':'wuhan',\n'interest':'playCards'\n]\n}\n
     */
    json = json.replace(/([\{\}])/g, '\n$1\n')
                .replace(/([\[\]])/g, '\n$1\n')
                .replace(/(\,)/g, '$1\n')
                .replace(/(\n\n)/g, '\n')
                .replace(/\n\,/g, ',');
    /** 
     * 根据split生成数据进行遍历，一行行判断是否增减PADDING
     */
   (json.split('\n')).forEach(function (node, index) {
        var indent = 0,
            padding = '';
        if (node.match(/\{$/) || node.match(/\[$/)) indent = 1;
        else if (node.match(/\}/) || node.match(/\]/))  padIdx = padIdx !== 0 ? --padIdx : padIdx;
        else    indent = 0;
        for (var i = 0; i < padIdx; i++)    padding += PADDING;
        formatted += padding + node + '\n';
        padIdx += indent;
    });
    return formatted;
};
function changeCode(btn){
	layui.use(['layer','jquery','code'], function() {
		var $ = layui.jquery;
		var layer = layui.layer;
		//获得代码块
		var pre = $(btn.parentNode.parentNode)
		var ol=pre.find(".layui-code-ol")[0];
		//带格式的文本
		var info = ol.innerText;
		layer.prompt({
			formType: 2,
			value: info,
			title: '请修改',
			area: ['600px','350px']
		},function(value,index,elem){
			//调用formatJson函数,将json格式进行格式化
			var json = formatJson(value);
			pre.html(json);
			layer.close(index);
			layui.code({elem:pre,skin:'notepad'});
			layui.each($(pre).find('li'),function(index,item){
				if(item.innerText.trim()===''){
					$(item).remove();
				}
			})
		});
	});
}