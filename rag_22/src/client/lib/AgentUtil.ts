import { marked } from 'marked';

const resultText = "";
const sessionData = { userId: "u_123", sessionId: "s_123"}

const AgentUtil = {

  validAgent: function (message: string){
    let ret = false;

    if(message.indexOf("sheet-list-agent") >= 0){
      return true;
    }
    if(message.indexOf("tool-sample-agent") >= 0){
      return true;
    }

    return ret;
  },
  /*
  *
  * @param
  *
  * @return
  */
  validAgentName: function (message: string): string {
    let ret = null;
    //console.log("validAgentName.message=", message);

    if(message.indexOf("tool_sample_agent") >= 0){
      return "tool_sample_agent";
    }

    return ret;
  },

  /*
  *
  * @param
  *
  * @return
  */
  initialAgent: async function(inText: string, appName: string) {
    try{
      const nowStr = new Date().getTime();
      sessionData.sessionId = "sid_" + nowStr;
      const item = {
        appName: appName ,
        messages: inText ,
        userId : sessionData.userId , 
        sessionId: sessionData.sessionId, 
      };
      const body: any = JSON.stringify(item);
      const res = await fetch('/api/adk_init' , {
        method: 'POST',
        headers: {'Content-Type': 'application/json'} ,
        body: body
      });
      if(res.ok === false){
       throw new Error("res.OK = NG"); 
      };
    }catch(e){
      console.error(e);
      throw new Error('Error , initialAgent');
    }
  } , 

  /*
  *
  * @param
  *
  * @return
  */
  postAgent: async function(inText: string, appName: string) {
    try{
      const item = {
        appName: appName ,
        userId : sessionData.userId , 
        sessionId: sessionData.sessionId, 
        messages: inText,
      };
      const body: any = JSON.stringify(item);		
      const res = await fetch("/api/adk_run", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},      
        body: body
      });
      if(res.ok === false){
       throw new Error("res.OK = NG"); 
      };
      const text = await res.text();
      //console.log(text);
      const json = JSON.parse(text);
      console.log(json);
      const outIndex = json.length - 1;
      console.log("#outIndex=", outIndex);
      console.log("artifact:");
      if(json[outIndex]){
        const target = json[outIndex].content;
        console.log(target.parts);
        if(target.parts[0]){
          console.log("text=", target.parts[0].text);
          return target.parts[0].text
        }else{
          console.log("text= NULL");
          return ""
        }
      }
    }catch(e){
      console.error(e);
      throw new Error('Error , postAgent');
    }
  } ,

}

export default AgentUtil;
