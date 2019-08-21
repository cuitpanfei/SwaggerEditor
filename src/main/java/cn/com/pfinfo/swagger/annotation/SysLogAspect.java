package cn.com.pfinfo.swagger.annotation;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import cn.com.pfinfo.swagger.bean.SysLogBean;
import cn.com.pfinfo.swagger.bean.User;
import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.json.JSONUtil;

@Aspect
@Component
public class SysLogAspect {
	
	//本地异常日志记录对象
    private  static  final Logger logger = LoggerFactory.getLogger(SysLogAspect.class);
 

    @Pointcut("@annotation(cn.com.pfinfo.swagger.annotation.SysLog)")
    public  void controllerAspect() {}  

    @Pointcut("@annotation(cn.com.pfinfo.swagger.annotation.SysLog)")
    public  void serviceAspect() {} 
    
    @After("controllerAspect()")
    public void doBefore(JoinPoint joinPoint) {
        try {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            String ip = request.getRemoteAddr();
            String description = getControllerMethodDescription(joinPoint);
            Object obj = request.getSession().getAttribute("loginUser");
            User user = new User();
            if(ObjectUtil.isNotNull(obj)){
            	BeanUtil.copyProperties(obj, user);
            }
            /*对象obj中必须拥有属性account、name*/
            if(StringUtils.isEmpty(user.getAccount())){
                user = new User("Anonymous", "匿名用户");
            }
            /*==========数据库日志=========*/
            SysLogBean log =  new SysLogBean();
            Map<String, Object> maps = new HashMap<String, Object>();
            Map<String, Object> parammaps = new HashMap<String, Object>();
            Object[] args = joinPoint.getArgs();
 
            //循环获得所有参数对象
            for(int i=0; i<args.length; i++){
                if (null != args[i]) {
                    parammaps.put("args["+i+"]", args[i]);
                }
                else {
                    parammaps.put("args["+i+"]", "空参数");
                }
            }
            maps.put("方法名", (joinPoint.getTarget().getClass().getName() + "." + joinPoint.getSignature().getName() + "()"));
            maps.put("参数", parammaps);
            maps.put("description",description);
            log.setIp(ip);
            log.setContent(JSONUtil.toJsonStr(maps));
            log.setUserName(user.getName());
            log.setCreatetime(DateUtil.now());
            log.setUrl(request.getRequestURI());
            logger.info(JSONUtil.toJsonStr(log));
        } catch (Exception e) {
        }
    } 
    
    /**
     * 异常通知 用于拦截service层记录异常日志
     *
     * @param joinPoint
     * @param e
     */
    @AfterThrowing(pointcut = "serviceAspect()", throwing = "e")
    public  void doAfterThrowing(JoinPoint joinPoint, Throwable e) {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        //读取session中的用户
        User user = (User)request.getSession().getAttribute("LoginUser");
        //获取请求ip
        String ip = request.getRemoteAddr();
        //获取用户请求方法的参数并序列化为JSON格式字符串
        String params = "";
        if (joinPoint.getArgs() !=  null && joinPoint.getArgs().length > 0) {
            for ( int i = 0; i < joinPoint.getArgs().length; i++) {
                params += JSONUtil.toJsonStr((joinPoint.getArgs()[i]) + ";");
            }
        }
        try {
            /*========控制台输出=========*/
//            System.out.println("=====异常通知开始=====");
//            System.out.println("异常代码:" + e.getClass().getName());
//            System.out.println("异常信息:" + e.getMessage());
//            System.out.println("异常方法:" + (joinPoint.getTarget().getClass().getName() + "." + joinPoint.getSignature().getName() + "()"));
//            System.out.println("方法描述:" + getServiceMthodDescription(joinPoint));
//            System.out.println("请求人:" + user.getName());
//            System.out.println("请求IP:" + ip);
//            System.out.println("请求参数:" + params);
            /*==========数据库日志=========*/
            SysLogBean log =  new SysLogBean();
            Map<String, Object> maps = new HashMap<String, Object>();
            Map<String, Object> parammaps = new HashMap<String, Object>();
            Object[] args = joinPoint.getArgs();
 
            //循环获得所有参数对象
            for(int i=0; i<args.length; i++){
                if (null != args[i]) {
                    parammaps.put("args["+i+"]", args[i]);
                }
                else {
                    parammaps.put("args["+i+"]", "空参数");
                }
            }
            maps.put("方法名", (joinPoint.getTarget().getClass().getName() + "." + joinPoint.getSignature().getName() + "()"));
            parammaps.put("方法名",joinPoint.getTarget().getClass().getName());
            maps.put("参数", parammaps);
            maps.put("ExceptionCode",e.getClass().getName());
            maps.put("ExceptionDetail",e.getMessage());
            maps.put("description",getServiceMthodDescription(joinPoint));
            log.setIp(ip);
            log.setContent(JSONUtil.toJsonStr(maps));
            log.setUserId(user.getId());
            log.setUserName(user.getName());
            log.setCreatetime(DateUtil.now());
            log.setUrl(request.getRequestURI());
            //保存数据库
            //logService.insert(log);
            logger.info(JSONUtil.toJsonStr(log));
            System.out.println("=====异常通知结束=====");
        }  catch (Exception ex) {
            //记录本地异常日志
            logger.error("==异常通知异常==");
            logger.error("异常信息:{}", ex.getMessage());
        }
         /*==========记录本地异常日志==========*/
        logger.error("异常方法:{}异常代码:{}异常信息:{}参数:{}", joinPoint.getTarget().getClass().getName() + joinPoint.getSignature().getName(), e.getClass().getName(), e.getMessage(), params);
 
    }
    
    /**
     * 获取注解中对方法的描述信息 用于service层注解
     *
     * @param joinPoint 切点
     * @return 方法描述
     * @throws Exception
     */
    public  static String getServiceMthodDescription(JoinPoint joinPoint)
            throws Exception {
        String targetName = joinPoint.getTarget().getClass().getName();
        String methodName = joinPoint.getSignature().getName();
        Object[] arguments = joinPoint.getArgs();
        Class<?> targetClass = Class.forName(targetName);
        Method[] methods = targetClass.getMethods();
        String description = "";
        for (Method method : methods) {
            if (method.getName().equals(methodName)) {
                Class<?>[] clazzs = method.getParameterTypes();
                if (clazzs.length == arguments.length) {
                    description = method.getAnnotation(SysLog.class).desc();
                    break;
                }
            }
        }
        return description;
    }
    
    /**
     * 获取注解中对方法的描述信息 用于Controller层注解
     *
     * @param joinPoint 切点
     * @return 方法描述
     * @throws Exception
     */
    @SuppressWarnings("rawtypes")
    private static String getControllerMethodDescription(JoinPoint joinPoint)  throws Exception {
        String targetName = joinPoint.getTarget().getClass().getName();
        String methodName = joinPoint.getSignature().getName();
        Object[] arguments = joinPoint.getArgs();
        Class targetClass = Class.forName(targetName);
        Method[] methods = targetClass.getMethods();
        String description = "";
        for (Method method : methods) {
            if (method.getName().equals(methodName)) {
                Class[] clazzs = method.getParameterTypes();
                if (clazzs.length == arguments.length) {
                    description = method.getAnnotation(SysLog.class).desc();
                    break;
                }
            }
        }
        return description;
    }
}