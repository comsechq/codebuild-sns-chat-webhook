var https = require('https');
var util = require('util');

exports.handler = function(event, context) {
	console.log(JSON.stringify(event, null, 2));
    console.log('From SNS:', event.Records[0].Sns.Message);

    var message = event.Records[0].Sns.Message;
	var jsonMessage = JSON.parse(message);
	
	if(message.includes('approval')) {
			
			message = `<${jsonMessage.consoleLink}|*[${jsonMessage.approval.pipelineName}]*> pipeline requires approval:

Stage  :  ${jsonMessage.approval.stageName}
Action :  ${jsonMessage.approval.actionName}

Please click <${jsonMessage.approval.approvalReviewLink}|here> to approve or refuse.

`;
	} else {
		if(jsonMessage.source.includes('aws.codepipeline')) {
			var pipelineUrl = `https://console.aws.amazon.com/codesuite/codepipeline/pipelines/${jsonMessage.detail.pipeline}`;
			
			message = `<${pipelineUrl}/view?region=${jsonMessage.region}|*[${jsonMessage.detail.pipeline}]*> pipeline has entered the state ${jsonMessage.detail.state}

Execution ID: <${pipelineUrl}/executions/${jsonMessage.detail['execution-id']}/timeline?region=${jsonMessage.region}|${jsonMessage.detail['execution-id']}>

`;
		}
		else {
			var buildUrl = `https://console.aws.amazon.com/codesuite/codebuild/projects/${jsonMessage.detail['project-name']}`;
			var buildId = jsonMessage.detail['build-id'];
		
			buildId = buildId.slice(buildId.lastIndexOf('/') + 1);
		
			message = `<${buildUrl}/details?region=${jsonMessage.region}|*[${jsonMessage.detail['project-name']}]*> build has entered the state ${jsonMessage.detail['build-status']}

Build ID: <${buildUrl}/build/${buildId}?region=${jsonMessage.region}|${buildId}>

`;
		}
	}		
    
    var postData = {
        "text": message
    };

    var options = {
        method: 'POST',
        hostname: 'chat.googleapis.com',
        port: 443,
        path: process.env.CHAT_API_PATH
    };

    var req = https.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        context.done(null);
      });
    });
    
    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });    

    req.write(util.format("%j", postData));
    req.end();
};