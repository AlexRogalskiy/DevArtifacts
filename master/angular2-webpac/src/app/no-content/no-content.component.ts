import { Component } from '@angular/core';

@Component({
  selector: 'no-content',
  template:
	`
		<div id="block_error">
			<div>
				<h2>404: page missing</h2>
				<p>
					It apperrs that Either something went wrong or the page doesn't exist anymore..<br />
					This website is temporarily unable to service your request as it has exceeded it’s resource limit. Please check back shortly.
				</p>
				<p>
					If you are the owner of the account and are regularly seeing this error, please read more about it in our <a href="http://www.namecheap.com/support/knowledgebase/article.aspx/1128/103/what-happens-when-my-account-reaches-lve-limits-diagnosing-and-resolving">knowledgebase</a>.
					If you have any questions, please contact our Technical Support department.
				</p>
			</div>
		</div>
	`,
	styles:
	[
	`
		p {
			font-size: 12px;
			color: #373737;
			font-family: Arial, Helvetica, sans-serif;
			line-height: 18px;
		}
		p a {
			color: #218bdc;
			font-size: 12px;
			text-decoration: none;
		}
		a {
			outline: none;
		}
		.f-left {
			float:left;
		}
		.f-right {
			float:right;
		}
		.clear {
			clear: both;
			overflow: hidden;
		}
		#block_error {
			width: 845px;
			height: 384px;
			border: 1px solid #cccccc;
			margin: 72px auto 0;
			-moz-border-radius: 4px;
			-webkit-border-radius: 4px;
			border-radius: 4px;
			background: #fff url(http://www.ebpaidrev.com/systemerror/block.gif) no-repeat 0 51px;
		}
		#block_error div {
			padding: 100px 40px 0 186px;
		}
		#block_error div h2 {
			color: #218bdc;
			font-size: 24px;
			display: block;
			padding: 0 0 14px 0;
			border-bottom: 1px solid #cccccc;
			margin-bottom: 12px;
			font-weight: normal;
		}
	`
	]
})
export class NoContentComponent {}
