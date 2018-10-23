layui.define(['element', 'layer', 'jquery','form','laytpl'], function(exports){ 
    var $ = layui.jquery;
    var element = layui.element;
    var layer= layui.layer;
    var form = layui.form;
    var laytpl = layui.laytpl;
    var addInterfaceHTML = '<button type="button" class="layui-btn layui-btn-xs addInterface" onclick="addInterface(this)">添加接口</button>';
    var interfaceHTMLTemplet ='';
    $.get("/components/layui/modules/interface.html",function(data){
    	interfaceHTMLTemplet=data;
    });
    var obj = {
        insertAfter: function (newElement, targetElement) {
            var parent = targetElement.parentNode;
            if (parent.lastChild == targetElement) {
                // 如果最后的节点是目标元素，则直接添加。因为默认是最后      
                parent.appendChild(newElement);
            } else {
                //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面。  
                parent.insertBefore(newElement, targetElement.nextSibling);
            }
        },

        /**
         * [creatTagElement 添加一个Tag]
         * @param {[string]} name [Tag 的名称]
         * @param {[string]} desc [Tag 的描述]
         */
        creatTagElement: function (name,desc){
            // 创建div  
            var tagElement = document.createElement("div");
            tagElement.setAttribute("class", "layui-colla-item");
            tagElement.setAttribute("name","operation-"+name);
            tagElement.setAttribute("id","");

            var h2 = document.createElement("h2");
            h2.setAttribute("class", "layui-colla-title");
            h2.innerHTML='<span class="fl"><b>'+name+'</b>&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;&nbsp;&nbsp;'+desc+'</span>'+
                         '<div class="fr button-group">'+
                            '<button type="button" class="layui-btn layui-btn-xs addTag" onclick="addTag(this)">在后面插入Tag</button>'+
                            '<button type="button" class="layui-btn layui-btn-xs delTag" onclick="delTag(this)">删除当前Tag</button>'+
                         '</div>';
            var content = document.createElement("div");
            content.setAttribute("class", "layui-colla-content");
            content.innerHTML=addInterfaceHTML;
            
            tagElement.appendChild(h2);
            tagElement.appendChild(content);
            return tagElement;
        },
        /**
         * [creatInterfaceElement 添加一个Interface]
         * @param {[string]} name [Interface 的名称]
         * @param {[string]} desc [Interface 的描述]
         */
        creatInterfaceElement: function (name,desc,method){
            // 创建div  
            var interfaceElement = document.createElement("div");
            interfaceElement.setAttribute("class", "layui-colla-item");
            interfaceElement.setAttribute("id","operation-"+method+"_"+name);

            var content = document.createElement("div");
            content.setAttribute("class", "layui-colla-content layui-show");
            laytpl(interfaceHTMLTemplet).render({name,desc,method},function(html){
                content.innerHTML = html;
            });
            interfaceElement.appendChild(content);
            return interfaceElement;
        },

        /**
         * [findTagTargetElement 从父节点中找TargetElement，如果找到root节点都没有找到，返回false]
         * @param  {[element]} element [起始按钮节点]
         * @param  {[string]} _class [期望的class]
         */
        findTargetElement: function (element,_class){
            var root = document.getElementById("root");
            if(element.getAttribute('class')&&element.getAttribute('class').indexOf(_class)>-1){
                return element;
            }else if(element == root){
                return false;
            }else{
                return this.findTagTargetElement(element.parentNode,_class);
            }
        },
        /**
         * [findTagTargetElement 从父节点中找到TagElement，如果找到root节点都没有找到，返回false]
         * @param  {[element]} element [起始按钮节点]
         */
        findTagTargetElement: function (element){
            return this.findTargetElement(element,'layui-colla-item');
        },
        /**
         * [findInterfaceElement 找到接口所在面板]
         * @param  {[type]} element [description]
         */
        findInterfaceElement: function (element){
        	var root = document.getElementById("root");
        	var baseNode = element.parentNode.parentNode.parentNode;
        	if(element.getAttribute('id')&&element.getAttribute('id').indexOf("operation-")>-1){
                return element;
            }else if(baseNode == root){
                return false;
            }else{
            	return this.findInterfaceElement(element.parentNode);
            }
        },

        /**
         * [addTag 添加一个模块]
         * @param {[element]} buttonElement [按钮所在节点]
         */
        addTag: function (buttonElement){
            var _this = this;
            layer.open({
                  type: 1,
                  skin: 'layui-layer-rim', //加上边框
                  area: ['380px', '240px'], //宽高
                  btn: ['确定','取消'],
                  yes: function(index,layero){
                    var targetElement = _this.findTagTargetElement(buttonElement);
                    var name = $(layero).find("#name")[0].value;
                    var desc = $(layero).find("#desc")[0].value;
                    var newElement = _this.creatTagElement(name,desc);
                    _this.insertAfter(newElement,targetElement);
                    element.render();
                    layer.close(index);
                  },
                  success: function(layero, index){
                    form.render();
                  },
                  content: '<div class="layui-form layui-form-pane" id="tagForm" style="padding:10px 20px;"><div class="layui-form-item"> <div class="layui-inline">   <label class="layui-form-label">Tag名</label> <div class="layui-input-inline"> <input type="text" id="name" name="name" lay-verify="title" autocomplete="off" placeholder="如：terminalInfo" class="layui-input"/> </div></div><div class="layui-inline"><label class="layui-form-label">描述</label> <div class="layui-input-inline"><input type="text" id="desc" name="desc" lay-verify="title" autocomplete="off" placeholder="请输入描述" class="layui-input"/> </div> </div></div></div> '
            });
        },
        /**
         * [delTag 删除一个模块]
         * @param  {[element]} buttonElement [删除按钮所在节点]
         */
        delTag: function (buttonElement){
            var _this = this;
            layer.confirm('你确定要删除当前模块（包括下面的接口）？', {
              btn: ['是的','不'] //按钮
            }, function(){
              var targetElement = _this.findTagTargetElement(buttonElement);    
              if(targetElement){
                $(targetElement).remove();
                layer.msg('已删除');
              }else{
                layer.msg('目标已不存在');
              }
            }, function(){
                layer.msg('取消删除');
            });
        },
        /**
         * [addInterface 添加一个模块]
         * @param {[element]} buttonElement [按钮所在节点]
         */
        addInterface: function(buttonElement){
            var _this = this;
            var _buttonElement = buttonElement;
            layer.open({
                  type: 1,
                  skin: 'layui-layer-rim', //加上边框
                  area: ['600px', '380px'], //宽高
                  btn: ['确定','取消'],
                  success: function(){
                	  form.render();
                  },
                  yes: function(index,layero){
                    var name = $(layero).find('#name')[0].value;
                    var desc = $(layero).find('#desc')[0].value;
                    var method = $(layero).find('div.layui-form-radioed')[0].lastChild.innerHTML;
                    var newElement = _this.creatInterfaceElement(name,desc,method);
                    _this.insertAfter(newElement,_buttonElement);
                    element.render();
                    layer.close(index);
                    layui.code();
                  },
                  content: '<div class="layui-form layui-form-pane" id="tagForm" style="padding: 10px;"><div class="layui-form-item" pane=""><label class="layui-form-label">类型</label><div class="layui-input-block"><input type="radio" name="method" value="GET" title="GET" checked/><input type="radio" name="method" value="POST" title="POST"/><input type="radio" name="method" value="PUT" title="PUT"/><input type="radio" name="method" value="DELETE" title="DELETE"/></div></div><div class="layui-form-item"><label class="layui-form-label">uri</label><div class="layui-input-block"><input type="text" id="name" name="name" lay-verify="required|name"autocomplete="off" placeholder="如：/terminalInfo"class="layui-input" /></div></div><div class="layui-form-item layui-form-text"><label class="layui-form-label">描述</label><div class="layui-input-block"><textarea id="desc" name="desc" lay-verify="required"placeholder="请输入描述" class="layui-textarea" ></textarea></div></div></div>'
            });
        },
        /**
         * [delInterface 删除一个接口]
         * @param  {[element]} buttonElement [按钮所在节点]
         */
        delInterface: function(buttonElement){
            var _this = this;
            layer.confirm('你确定要删除当前接口？', {
              btn: ['是的','不'] //按钮
            }, function(){
              var targetElement = _this.findInterfaceElement(buttonElement);    
              if(targetElement){
                $(targetElement).remove();
                layer.msg('已删除');
              }else{
                layer.msg('目标已不存在');
              }
            }, function(){
                layer.msg('取消删除');
            });
        }
    };
    //输出接口
    exports('swagger', obj);
});