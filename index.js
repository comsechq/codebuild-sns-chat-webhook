var https = require('https');
var util = require('util');
var moment = require('moment.js');

function generateCardForCodeBuild(json) {
	
	var time = moment(json.tim).format('YYYY-MM-DDTHH:mm:ssZ');
	
	var buildProjectName = json.detail['project-name'];
	var buildProjectUrl = `https://console.aws.amazon.com/codesuite/codebuild/projects/${buildProjectName}`;
	
	var buildId = json.detail['build-id'];
	buildId = buildId.slice(buildId.lastIndexOf('/') + 1);
	
	var buildDetailsUrl = `${buildProjectUrl}/details?region=${json.region}`;
	var buildUrl = `${buildProjectUrl}/build/${buildId}?region=${json.region}`;
	var buildState = json.detail['build-status'];
	
	var style = 'default';
	
	if(buildState == 'SUCCEEDED') {
		style = 'good';
	} else if(buildState == 'FAILED') {
		style = 'attention';
	}
	
	return {
		"type": "message",
		"attachments": [
			{
				"contentType": "application/vnd.microsoft.card.adaptive",
				"contentUrl": null,
				"content": {
					"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
					"type": "AdaptiveCard",
					"version": "1.5",
					"body": [
						{
							"type": "Container",
							"items": [
								{
									"type": "TextBlock",
									"text": "CodeBuild: Build Stage Changed",
									"weight": "bolder",
									"size": "medium"
								},
								{
									"type": "ColumnSet",
									"columns": [
										{
											"type": "Column",
											"width": "auto",
											"items": [
												{
													"type": "Image",
													"url": "data:image/png;base64,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",
													"altText": "CodeBuild",
													"size": "medium",
													"style": "person"
												}
											]
										},
										{
											"type": "Column",
											"width": "stretch",
											"items": [
												{
													"type": "TextBlock",
													"text": buildProjectName,
													"weight": "bolder"
												},
												{
													"type": "TextBlock",
													"spacing": "none",
													"text": "@ {{DATE(" + time + ", SHORT)}} {{TIME(" + time + ")}}",
													"isSubtle": true
												}
											]
										}
									]
								}
							]
						},
						{
							"type": "Container",
							"style": style,
							"items": [
								{
									"type": "FactSet",
									"facts": [
										{
											"title": "Build ID:",
											"value": buildId
										},
										{
											"title": "Status:",
											"value":  buildState
										}
									]
								}
							]
						}
					],
					"actions": [
						{
						  "type": "Action.OpenUrl",
						  "title": "View Build",
						  "url": buildUrl
						},
						{
						  "type": "Action.OpenUrl",
						  "title": "View Build Details",
						  "url": buildDetailsUrl
						},
						{
						  "type": "Action.OpenUrl",
						  "title": "View Project",
						  "url": buildProjectUrl
						}
					]
				}
			}
		]
	};	
};

function generateCardForCodePipeline(json) {
	
	var time = moment(json.tim).format('YYYY-MM-DDTHH:mm:ssZ');
	
	var pipelineName = json.detail.pipeline;
	var pipelineUrl = `https://console.aws.amazon.com/codesuite/codepipeline/pipelines/${json.detail.pipeline}/view?region=${json.region}`;
	
	var pipelineExecutionId = json.detail['execution-id'];
	var pipelineExecutionUrl = `${pipelineUrl}/executions/${pipelineExecutionId}/timeline?region=${json.region}`
	var pipelineExecutionState = json.detail.state;
	
	var style = 'accent';
	
	if(pipelineExecutionState == 'SUCCEEDED') {
		style = 'good';
	} else if(pipelineExecutionState == 'FAILED') {
		style = 'attention';
	}
	
	return {
		"type": "message",
		"attachments": [
			{
				"contentType": "application/vnd.microsoft.card.adaptive",
				"contentUrl": null,
				"content": {
					"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
					"type": "AdaptiveCard",
					"version": "1.5",
					"body": [
						{
							"type": "Container",
							"items": [
								{
									"type": "TextBlock",
									"text": "CodePipeline: Execution Stage Changed",
									"weight": "bolder",
									"size": "medium"
								},
								{
									"type": "ColumnSet",
									"columns": [
										{
											"type": "Column",
											"width": "auto",
											"items": [
												{
													"type": "Image",
													"url": "data:image/png;base64,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",
													"altText": "CodePipeline",
													"size": "medium",
													"style": "person"
												}
											]
										},
										{
											"type": "Column",
											"width": "stretch",
											"items": [
												{
													"type": "TextBlock",
													"text": pipelineName,
													"weight": "bolder"
												},
												{
													"type": "TextBlock",
													"spacing": "none",
													"text": "@ {{DATE(" + time + ", SHORT)}} {{TIME(" + time + ")}}",
													"isSubtle": true
												}
											]
										}
									]
								}
							]
						},
						{
							"type": "Container",
							"style": style,
							"items": [
								{
									"type": "FactSet",
									"facts": [
										{
											"title": "Execution ID:",
											"value": pipelineExecutionId
										},
										{
											"title": "Status:",
											"value": pipelineExecutionState
										}
									]
								}
							]
						}
					],
					"actions": [
						{
						  "type": "Action.OpenUrl",
						  "title": "View Execution",
						  "url": pipelineUrl
						},
						{
						  "type": "Action.OpenUrl",
						  "title": "View Pipeline",
						  "url": pipelineExecutionUrl
						}
					]
				}
			}
		]
	};
};

function generateCardForCodePipelineApproval(json) {
	
	var expiryDate = moment(json.approval.expires).format('YYYY-MM-DDTHH:mm:ssZ');
	
	var pipelineName = json.approval.pipelineName;
	var pipelineUrl = json.consoleLink;
	
	var pipelineStageName = json.approval.stageName;
	var pipelineActionName = json.approval.actionName;
	var pipelineApprovalLink = json.approval.approvalReviewLink;

	return {
		"type": "message",
		"attachments": [
			{
				"contentType": "application/vnd.microsoft.card.adaptive",
				"contentUrl": null,
				"content": {
					"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
					"type": "AdaptiveCard",
					"version": "1.5",
					"body": [
						{
							"type": "Container",
							"items": [
								{
									"type": "TextBlock",
									"text": "CodePipeline: Approval Required",
									"weight": "bolder",
									"size": "medium"
								},
								{
									"type": "ColumnSet",
									"columns": [
										{
											"type": "Column",
											"width": "auto",
											"items": [
												{
													"type": "Image",
													"url": "data:image/png;base64,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",
													"altText": "CodePipeline",
													"size": "medium",
													"style": "person"
												}
											]
										},
										{
											"type": "Column",
											"width": "stretch",
											"items": [
												{
													"type": "TextBlock",
													"text": pipelineName,
													"weight": "bolder"
												},
												{
													"type": "TextBlock",
													"spacing": "none",
													"text": "Expires {{DATE(" + expiryDate + ", SHORT)}} {{TIME(" + expiryDate + ")}}",
													"isSubtle": true
												}
											]
										}
									]
								}
							]
						},
						{
							"type": "Container",
							"style": "default",
							"items": [
								{
									"type": "FactSet",
									"facts": [
										{
											"title": "Stage:",
											"value": pipelineStageName
										},
										{
											"title": "Action:",
											"value": pipelineActionName
										}
									]
								}
							]
						}
					],
					"actions": [
						{
						  "type": "Action.OpenUrl",
						  "title": "Approve",
						  "tooltip": "Please click here to approve or refuse.",
						  "url": pipelineApprovalLink
						},
						{
						  "type": "Action.OpenUrl",
						  "title": "View Pipeline",
						  "url": pipelineUrl
						}
					]
				}
			}
		]
	};
};

exports.handler = function(event, context) {
	console.log(JSON.stringify(event, null, 2));
    console.log('From SNS:', event.Records[0].Sns.Message);

    var message = event.Records[0].Sns.Message;
	var jsonMessage = JSON.parse(message);

	var card;
	
	if(message.includes('approval')) {
		card = generateCardForCodePipelineApproval(jsonMessage);
	} else {
		if(jsonMessage.source.includes('aws.codepipeline')) {
			card = generateCardForCodePipeline(jsonMessage);
		}
		else {
			card = generateCardForCodeBuild(jsonMessage);
		}
	}
	
	var cardJson = JSON.stringify(card);
	console.log(cardJson);
	
    var options = {
        method: 'POST',
        hostname: 'itipsorg.webhook.office.com',
        port: 443,
        path: process.env.CHAT_API_PATH
    };

    var req = https.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', (d) => {
	    console.log(d);
	  });
    });
    
    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });    
    
    req.write(cardJson);
    req.end();
};