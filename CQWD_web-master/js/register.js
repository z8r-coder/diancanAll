 onload=function(){  
        var e=document.getElementById("refreshed");  
        if(e.value=="no")e.value="yes";  
        else{e.value="no";location.reload();}  
  }  
  
  
   function login()
	 {
	 	 window.location.href='login.html';  
	 }

//注册请求
	 	function register() {	 		
        	if(form1.userName.value==""||form1.tel.value==""||form1.password.value==""||form1.password2.value=="")
        	{
        	  sweetAlert("提示","输入不能为空！","warning");
        	  return;
        	}
        	if(form1.password.value!=form1.password2.value)
        	{
        	  sweetAlert("提示","两次输入密码不一致！","warning");
        	  return;
        	}
      	    var name=form1.userName.value;     	  
      	    var tel=form1.tel.value;
        	if(!isPoneAvailable(tel))
        	{
        	  sweetAlert("提示","手机号无效！","warning");
        	  return;
        	}
        	var pwd = hex_sha1(form1.password.value);	
        	var u="http://192.168.1.196:9090//outerApi/userRegister?user_name="+
        	name+"&user_phone="+tel+"&user_password="+pwd;
            $.ajax({
                type: "POST",//方法类型
                url: u,//url   
                timeout : 1000, 
                contentType: "application/x-www-form-urlencoded",
                async: false,
                success: function (r) {
                	var result = eval( '(' + r + ')' );               	
                    if (result["rspCode"] == "DC00000") {
                    	swal({ 
                     title: "注册成功！", 
                     type: "success",
                     text: "可以开始登录了。", 
                     timer: 2000, 
                     confirmButtonColor: "#FFFFFF",                
                   }); 
                    setTimeout('window.location.href="login.html";',2000);  
                    }else
                      sweetAlert("提示",result["rspMsg"],"warning");
                },
              error : function() {
                     sweetAlert("系统错误","用户注册失败！", "warning");
                }
            });
        
        }
        
       function isPoneAvailable(str) {  
          var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;  
          if (!myreg.test(str)) {  
              return false;  
          } else {  
              return true;  
          }  
      }