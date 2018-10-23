package cn.com.pfinfo.swagger.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
@Api(value = "swagger Markdown 撰写接口")
public class IndexController {

	@GetMapping({"","/index"})
	@ApiOperation(value = "获取撰写页面")
	public String index(){
		return "index";
	}
}
