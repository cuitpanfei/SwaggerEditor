layui.define(['element', 'layer', 'jquery', 'form', 'laytpl', 'code'],
function(exports) {
    var $ = layui.jquery;
    var element = layui.element;
    var layer = layui.layer;
    var form = layui.form;
    var laytpl = layui.laytpl;
    var addInterfaceHTML = '<button type="button" class="layui-btn layui-btn-xs addInterface" onclick="addInterface(this)">添加接口</button>';
    var interfaceHTMLTemplet = '';
    $.get("/components/layui/modules/interface.html",
    function(data) {
        interfaceHTMLTemplet = data;
    });
    var obj = {
        insertAfter: function(newElement, targetElement) {
            var parent = targetElement.parentNode;
            if (parent.lastChild == targetElement) {
                // 如果最后的节点是目标元素，则直接添加。因为默认是最后
                parent.appendChild(newElement);
            } else {
                // 如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面。
                parent.insertBefore(newElement, targetElement.nextSibling);
            }
        },

        /**
		 * [creatTagElement 添加一个Tag]
		 * 
		 * @param {[string]}
		 *            name [Tag 的名称]
		 * @param {[string]}
		 *            desc [Tag 的描述]
		 */
        creatTagElement: function(name, desc) {
            // 创建div
            var tagElement = document.createElement("div");
            tagElement.setAttribute("class", "layui-colla-item");
            tagElement.setAttribute("name", "operation-" + name);
            tagElement.setAttribute("id", "");

            var h2 = document.createElement("h2");
            h2.setAttribute("class", "layui-colla-title");
            h2.innerHTML = '<span class="fl"><b>' + name + '</b>&nbsp;&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;&nbsp;&nbsp;' + desc + '</span>' + '<div class="fr button-group">' + '<button type="button" class="layui-btn layui-btn-xs layui-btn-normal addTag" onclick="addTag(this)"><i class="layui-icon">&#xe654;</i>在后面插入Tag</button>' + '<button type="button" class="layui-btn layui-btn-xs layui-btn-danger delTag" onclick="delTag(this)"><i class="layui-icon">&#xe640;</i>删除当前Tag</button>' + '</div>';
            var content = document.createElement("div");
            content.setAttribute("class", "layui-colla-content");
            content.innerHTML = addInterfaceHTML;
            tagElement.appendChild(h2);
            tagElement.appendChild(content);
            return tagElement;
        },
        /**
		 * [creatInterfaceElement 添加一个Interface]
		 * 
		 * @param {[string]}
		 *            name [Interface 的名称]
		 * @param {[string]}
		 *            desc [Interface 的描述]
		 */
        creatInterfaceElement: function(name, desc, method) {
            // 创建div
            var interfaceElement = document.createElement("div");
            interfaceElement.setAttribute("class", "layui-colla-item");
            interfaceElement.setAttribute("id", "operation-" + method + "_" + name);

            var content = document.createElement("div");
            content.setAttribute("class", "layui-colla-content layui-show");
            laytpl(interfaceHTMLTemplet).render({
                name,
                desc,
                method
            },
            function(html) {
                content.innerHTML = html;
            });
            layui.each($(content).find('pre'),
            function(index, pre) {
                layui.code({
                    elem: pre,
                    skin: 'notpadd'
                });
            });
            interfaceElement.appendChild(content);
            return interfaceElement;
        },

        /**
		 * [findTagTargetElement 从父节点中找TargetElement，如果找到root节点都没有找到，返回false]
		 * 
		 * @param {[element]}
		 *            element [起始按钮节点]
		 * @param {[string]}
		 *            _class [期望的class]
		 */
        findTargetElement: function(element, _class) {
            var root = document.getElementById("root");
            if (element.getAttribute('class') && element.getAttribute('class').indexOf(_class) > -1) {
                return element;
            } else if (element == root) {
                return false;
            } else {
                return this.findTagTargetElement(element.parentNode, _class);
            }
        },
        /**
		 * [findTagTargetElement 从父节点中找到TagElement，如果找到root节点都没有找到，返回false]
		 * 
		 * @param {[element]}
		 *            element [起始按钮节点]
		 */
        findTagTargetElement: function(element) {
            return this.findTargetElement(element, 'layui-colla-item');
        },
        /**
		 * [findInterfaceElement 找到接口所在面板]
		 * 
		 * @param {[type]}
		 *            element [description]
		 */
        findInterfaceElement: function(element) {
            var root = document.getElementById("root");
            var baseNode = element.parentNode.parentNode.parentNode;
            if (element.getAttribute('id') && element.getAttribute('id').indexOf("operation-") > -1) {
                return element;
            } else if (baseNode == root) {
                return false;
            } else {
                return this.findInterfaceElement(element.parentNode);
            }
        },

        /**
		 * [addTag 添加一个模块]
		 * 
		 * @param {[element]}
		 *            buttonElement [按钮所在节点]
		 */
        addTag: function(buttonElement) {
            var _this = this;
            layer.open({
                type: 1,
                skin: 'layui-layer-rim',
                // 加上边框
                area: ['380px', '240px'],
                // 宽高
                btn: ['确定', '取消'],
                yes: function(index, layero) {
                    var targetElement = _this.findTagTargetElement(buttonElement);
                    var name = $(layero).find("#name")[0].value;
                    var desc = $(layero).find("#desc")[0].value;
                    var newElement = _this.creatTagElement(name, desc);
                    _this.insertAfter(newElement, targetElement);
                    element.render();
                    layer.close(index);
                },
                success: function(layero, index) {
                    form.render();
                },
                content: '<div class="layui-form layui-form-pane" id="tagForm" style="padding:10px 20px;"><div class="layui-form-item"> <div class="layui-inline">   <label class="layui-form-label">Tag名</label> <div class="layui-input-inline"> <input type="text" id="name" name="name" lay-verify="title" autocomplete="off" placeholder="如：terminalInfo" class="layui-input"/> </div></div><div class="layui-inline"><label class="layui-form-label">描述</label> <div class="layui-input-inline"><input type="text" id="desc" name="desc" lay-verify="title" autocomplete="off" placeholder="请输入描述" class="layui-input"/> </div> </div></div></div> '
            });
        },
        /**
		 * [delTag 删除一个模块]
		 * 
		 * @param {[element]}
		 *            buttonElement [删除按钮所在节点]
		 */
        delTag: function(buttonElement) {
            var _this = this;
            layer.confirm('你确定要删除当前模块（包括下面的接口）？', {
                btn: ['是的', '不'] // 按钮
            },
            function() {
                var targetElement = _this.findTagTargetElement(buttonElement);
                if (targetElement) {
                    $(targetElement).remove();
                    layer.msg('已删除');
                } else {
                    layer.msg('目标已不存在');
                }
            },
            function() {
                layer.msg('取消删除');
            });
        },
        /**
		 * [addInterface 添加一个模块]
		 * 
		 * @param {[element]}
		 *            buttonElement [按钮所在节点]
		 */
        addInterface: function(buttonElement) {
            var _this = this;
            var _buttonElement = buttonElement;
            layer.open({
                type: 1,
                skin: 'layui-layer-rim',
                // 加上边框
                area: ['600px', '380px'],
                // 宽高
                btn: ['确定', '取消'],
                success: function() {
                    form.render();
                },
                yes: function(index, layero) {
                    var name = $(layero).find('#name')[0].value;
                    var desc = $(layero).find('#desc')[0].value;
                    var method = $(layero).find('div.layui-form-radioed')[0].lastChild.innerHTML;
                    var newElement = _this.creatInterfaceElement(name, desc, method);
                    _this.insertAfter(newElement, _buttonElement);
                    element.render();
                    layer.close(index);
                },
                content: '<div class="layui-form layui-form-pane" id="tagForm" style="padding: 10px;"><div class="layui-form-item" pane=""><label class="layui-form-label">类型</label><div class="layui-input-block"><input type="radio" name="method" value="GET" title="GET" checked/><input type="radio" name="method" value="POST" title="POST"/><input type="radio" name="method" value="PUT" title="PUT"/><input type="radio" name="method" value="DELETE" title="DELETE"/></div></div><div class="layui-form-item"><label class="layui-form-label">uri</label><div class="layui-input-block"><input type="text" id="name" name="name" lay-verify="required|name"autocomplete="off" placeholder="如：/terminalInfo"class="layui-input" /></div></div><div class="layui-form-item layui-form-text"><label class="layui-form-label">描述</label><div class="layui-input-block"><textarea id="desc" name="desc" lay-verify="required"placeholder="请输入描述" class="layui-textarea" ></textarea></div></div></div>'
            });
        },
        /**
		 * [delInterface 删除一个接口]
		 * 
		 * @param {[element]}
		 *            buttonElement [按钮所在节点]
		 */
        delInterface: function(buttonElement) {
            var _this = this;
            layer.confirm('你确定要删除当前接口？', {
                btn: ['是的', '不'] // 按钮
            },
            function() {
                var targetElement = _this.findInterfaceElement(buttonElement);
                if (targetElement) {
                    $(targetElement).remove();
                    layer.msg('已删除');
                } else {
                    layer.msg('目标已不存在');
                }
            },
            function() {
                layer.msg('取消删除');
            });
        },
        md5: function md5(string) {
            function md5_RotateLeft(lValue, iShiftBits) {
                return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
            }
            function md5_AddUnsigned(lX, lY) {
                var lX4, lY4, lX8, lY8, lResult;
                lX8 = (lX & 0x80000000);
                lY8 = (lY & 0x80000000);
                lX4 = (lX & 0x40000000);
                lY4 = (lY & 0x40000000);
                lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                if (lX4 & lY4) {
                    return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                }
                if (lX4 | lY4) {
                    if (lResult & 0x40000000) {
                        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                    } else {
                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                    }
                } else {
                    return (lResult ^ lX8 ^ lY8);
                }
            }
            function md5_F(x, y, z) {
                return (x & y) | ((~x) & z);
            }
            function md5_G(x, y, z) {
                return (x & z) | (y & (~z));
            }
            function md5_H(x, y, z) {
                return (x ^ y ^ z);
            }
            function md5_I(x, y, z) {
                return (y ^ (x | (~z)));
            }
            function md5_FF(a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };
            function md5_GG(a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };
            function md5_HH(a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };
            function md5_II(a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };
            function md5_ConvertToWordArray(string) {
                var lWordCount;
                var lMessageLength = string.length;
                var lNumberOfWords_temp1 = lMessageLength + 8;
                var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
                var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                var lWordArray = Array(lNumberOfWords - 1);
                var lBytePosition = 0;
                var lByteCount = 0;
                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                    lByteCount++;
                }
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                return lWordArray;
            };
            function md5_WordToHex(lValue) {
                var WordToHexValue = "",
                WordToHexValue_temp = "",
                lByte, lCount;
                for (lCount = 0; lCount <= 3; lCount++) {
                    lByte = (lValue >>> (lCount * 8)) & 255;
                    WordToHexValue_temp = "0" + lByte.toString(16);
                    WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
                }
                return WordToHexValue;
            };
            function md5_Utf8Encode(string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";
                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    } else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }
                return utftext;
            };
            var x = Array();
            var k, AA, BB, CC, DD, a, b, c, d;
            var S11 = 7,
            S12 = 12,
            S13 = 17,
            S14 = 22;
            var S21 = 5,
            S22 = 9,
            S23 = 14,
            S24 = 20;
            var S31 = 4,
            S32 = 11,
            S33 = 16,
            S34 = 23;
            var S41 = 6,
            S42 = 10,
            S43 = 15,
            S44 = 21;
            string = md5_Utf8Encode(string);
            x = md5_ConvertToWordArray(string);
            a = 0x67452301;
            b = 0xEFCDAB89;
            c = 0x98BADCFE;
            d = 0x10325476;
            for (k = 0; k < x.length; k += 16) {
                AA = a;
                BB = b;
                CC = c;
                DD = d;
                a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                a = md5_AddUnsigned(a, AA);
                b = md5_AddUnsigned(b, BB);
                c = md5_AddUnsigned(c, CC);
                d = md5_AddUnsigned(d, DD);
            }
            return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
        }
    };
    // 输出接口
    exports('swagger', obj);
});