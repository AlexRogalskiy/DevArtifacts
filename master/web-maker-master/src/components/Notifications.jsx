import { h } from 'preact';
import { Button } from './common';

function NotificationItem({ type, children }) {
	var strongTag;
	if (type === 'bug') {
		strongTag = <strong>🔧 Bugfix</strong>;
	} else if (type === 'a11y') {
		strongTag = <strong>♿️ Accessibility</strong>;
	} else if (type === 'ui') {
		strongTag = <strong>🖥 Interface</strong>;
	}
	return (
		<li>
			{strongTag}: {children}
		</li>
	);
}

function ThanksTo({ name, url }) {
	return (
		<a href={url} target="_blank" rel="noopener noreferrer">
			{' '}
			{name}
		</a>
	);
}

function Notification({ version, isLatest, ...props }) {
	return (
		<div class="notification">
			<span class="notification__version">{version}</span>
			<ul>{props.children}</ul>
			{isLatest ? (
				<div class="mt-2">
					<p>
						<strong>🚀 Announcement</strong>: Hi! I am Kushagra Gour (creator of
						Web Maker) and I have launched a
						<a
							href="https://patreon.com/kushagra"
							target="_blank"
							rel="noopener noreferrer"
						>
							{' '}
							Patreon campaign
						</a>. If you love Web Maker, consider pledging to
						<a
							href="https://patreon.com/kushagra"
							target="_blank"
							rel="noopener noreferrer"
						>
							{' '}
							support me
						</a>{' '}
						:)
					</p>
					<p>
						<a
							href="https://github.com/chinchang/web-maker/issues"
							target="_blank"
							rel="noopener noreferrer"
						>
							Suggest features or report bugs.
						</a>
					</p>
					<p>
						Web Maker now has more than 50K weekly active users! Thank you for
						being a part of this community of awesome developers. If you find
						Web Maker helpful,{' '}
						<a
							href="https://chrome.google.com/webstore/detail/web-maker/lkfkkhfhhdkiemehlpkgjeojomhpccnh/reviews"
							target="_blank"
							rel="noopener noreferrer"
							class="btn"
						>
							Please rate Web Maker <span class="star" />
						</a>&nbsp;
						<a
							href="http://twitter.com/share?url=https://webmakerapp.com/&text=Web Maker - A blazing fast %26 offline web playground! via @webmakerApp&related=webmakerApp&hashtags=web,editor,chrome,extension"
							target="_blank"
							rel="noopener noreferrer"
							class="btn"
						>
							Share it
						</a>&nbsp;
						<Button
							aria-label="Support the developer"
							onClick={props.onSupportBtnClick}
							data-event-action="supportDeveloperChangelogBtnClick"
							data-event-category="ui"
							class="btn btn-icon"
						>
							Support the developer
						</Button>
					</p>
				</div>
			) : null}
		</div>
	);
}
export function Notifications(props) {
	return (
		<div>
			<h1>Whats new?</h1>

			<Notification version="3.4.0" isLatest={true} {...props}>
				<li>
					<strong>🎉 Js13kGames Mode</strong>: For all you Js13kGames compo
					participants out there. Turn it on from Settings.{' '}
					<a
						href="https://medium.com/web-maker/js13kgames-jam-with-web-maker-a3389cf2cbb"
						target="_blank"
						rel="noopener"
					>
						Read more about it here.
					</a>
				</li>
				<li>
					<strong>🎉 Templates</strong>: Presenting, templates for major
					libraries and frameworks. Hit the "New" button to explore.
				</li>
				<NotificationItem type="a11y">
					Add missing focus rings around focusable element.
				</NotificationItem>
				<NotificationItem type="ui">
					Migrate remaining interface elements to dark theme. Now complete app
					is in dark theme.
				</NotificationItem>
				<NotificationItem type="bug">
					Fix "Save as HTML" and "Take Screenshot" features in Chrome extension.
				</NotificationItem>
			</Notification>

			<Notification version="3.3.2" {...props}>
				<NotificationItem type="a11y">
					Improper links are now buttons with proper focus indication and
					screen-reader support. Thanks{' '}
					<ThanksTo url="https://github.com/jpsc" name="@jpsc" />
				</NotificationItem>
				<NotificationItem type="bug">
					Auto-complete suggestions are now working.
				</NotificationItem>
				<NotificationItem type="bug">
					Fixes resetting pane sizes when opening any popup or console.
				</NotificationItem>
				<li>
					<strong>[Dev] Tests</strong>: We now have one running automated test
					:) More to come. Thanks{' '}
					<ThanksTo url="https://github.com/DanielRuf" name="@DanielRuf" />
				</li>
			</Notification>

			<Notification version="3.3.0" {...props}>
				<li>
					<strong>🔥 [Dev] Code Refactor</strong>: I rewrote Web Maker. Yes, Web
					Maker's codebase has been ported from plain JS to{' '}
					<a
						href="https://preactjs.com/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Preact
					</a>. What does this mean for you as a end-user? This means that now
					that the code is much smaller, more modular and maintainable. Hence,
					future features can be developed more rapidly. So fasten your seat
					belts, and get ready to use loads of new features coming your way in
					next releases!<br />
					<a
						href="https://medium.com/web-maker/web-maker-is-now-in-preact-85af98be8683"
						target="_blank"
						rel="noopener noreferrer"
					>
						Read more about this big code refactor
					</a>.
				</li>
				<li>
					<a href="https://p5js.org/" target="_blank" rel="noopener noreferrer">
						p5.js
					</a>{' '}
					added to popular JS libraries list. Thanks{' '}
					<ThanksTo url="https://github.com/nucliweb" name="@nucliweb" />.
				</li>
			</Notification>

			<Notification version="3.2.0" {...props}>
				<li>
					<strong>🚀 Loop timeout setting</strong>: You now have a setting to
					tweak the maximum timeout of a loop iteration before it's marked as
					infinite loop.
				</li>
				<NotificationItem type="a11y">
					Modals now have proper keyboard navigation integrated.
				</NotificationItem>
				<NotificationItem type="a11y">
					Color contrast improvements.
				</NotificationItem>
				<li>
					🚀 Popular libraries list updated. Thanks
					<ThanksTo url="https://github.com/diomed" name="@diomed" /> &{' '}
					<ThanksTo
						url="https://github.com/leninalbertolp"
						name="@leninalbertolp"
					/>
				</li>
				<NotificationItem type="bug">
					Modal take up appropriate width instead of spanning full width.
				</NotificationItem>
			</Notification>

			<Notification version="3.1.1" {...props}>
				<NotificationItem type="bug">
					Fix the "Run" button not refreshing the preview after release 3.0.4.
				</NotificationItem>
			</Notification>

			<Notification version="3.1.0" {...props}>
				<li>
					<strong>Mobile Support (app only).</strong>: Make the Web Maker app
					usable on mobile. This is only for web app as Chrome extensions don't
					run on mobile.
				</li>
			</Notification>

			<Notification version="3.0.4" {...props}>
				<NotificationItem type="bug">
					Guarantee code doesn't execute when "auto preview" is off.
				</NotificationItem>
				<li>
					Add link to our new
					<a
						href="https://web-maker.slack.com"
						target="_blank"
						rel="noopener noreferrer"
					>
						Slack channel
					</a>{' '}
					🤗.
				</li>
			</Notification>

			<Notification version="3.0.3" {...props}>
				<li>
					<strong>Bugfix (extension)</strong>: "Save as HTML" file saves with
					correct extension.
				</li>
			</Notification>

			<div class="notification">
				<span class="notification__version">3.0.1</span>
				<ul>
					<li>
						After months of work, here is Web Maker 3.0.
						<a
							href="https://medium.com/web-maker/web-maker-3-0-is-here-f158a40eeaee"
							target="_blank"
							rel="noopener noreferrer"
						>
							{' '}
							Read the blog post about it
						</a>.
					</li>
					<li>
						Web Maker is no more just a Chrome extension, it is also available
						as web app that runs offline just like the extension! Checkout it
						out ->
						<a
							href="https://webmakerapp.com/app/"
							target="_blank"
							rel="noopener noreferrer"
						>
							https://webmakerapp.com/app/
						</a>.
					</li>
					<li>
						Now use Web Maker web app on any modern browser (tested with Chrome
						and Firefox).
					</li>
					<li>
						<strong>User Accounts</strong> - The much requested user accounts
						are here. Now maintain your account and store all your creations in
						the cloud and access them anywhere anytime.
					</li>
					<li>
						<strong>New layout mode</strong> - One more layout mode, that lets
						you align all the panes vertically.
					</li>
					<li>
						<strong>No more restriction on scripts (Web app only)</strong> - If
						you are using the web app, there is no more a restriction to load
						scripts from only specific domains. Load any script!
					</li>
					<li>
						<strong>Inline scripts (Web app only)</strong> - The restriction of
						writing JavaScript only in JS pane is also removed.
					</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.9.7</span>
				<ul>
					<li>
						<a
							href="https://tailwindcss.com/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Tailwind CSS
						</a>{' '}
						added to popular CSS libraries list. Thanks{' '}
						<ThanksTo url="https://github.com/diomed" name="diomed" />.
					</li>
					<li>
						Popular libraries list updated. Thanks{' '}
						<ThanksTo url="https://github.com/diomed" name="diomed" />.
					</li>
					<li>
						<strong>Dev</strong>: Bug fixes and code refactoring to make things
						simple.{' '}
						<ThanksTo
							url="https://github.com/iamandrewluca"
							name="iamandrewluca"
						/>{' '}
						.
					</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.9.6</span>
				<ul>
					<li>
						<strong>Bugfix</strong>: Fix close buttons not working in
						notifications and keyboard shortcuts modal.
					</li>
					<li>
						<strong>Bugfix</strong>: Fix keyboard shortcut to see keyboard
						shortcuts :) Thanks
						<a
							href="https://github.com/ClassicOldSong"
							target="_blank"
							rel="noopener noreferrer"
						>
							ClassicOldSong
						</a>.
					</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.9.5</span>
				<ul>
					<li>
						<a
							href="https://medium.com/web-maker/release-2-9-5-add-library-search-pane-collapsing-ux-improvements-more-1085216c1301"
							target="_blank"
							rel="noopener noreferrer"
						>
							Read blog post about this release.
						</a>
					</li>
					<li>
						<strong>Keyboard shortcuts panel</strong>: Add a list of all
						keyboard shotcuts. Access with
						<code> Ctrl/⌘ + Shift + ?</code> or click keyboard button in footer.
					</li>
					<li>
						<strong>Add external library</strong>: Better UX for searching third
						party libraries.
					</li>
					<li>
						<strong>Improvement</strong>: Code panes now go fullscreen when
						double-clicked on their headers - which is much more intuitive
						behavior based on feedback from lot of developers.
					</li>
					<li>
						<strong>Improvement</strong>: Add
						<code>allowfullscreen</code> attribute on iframes. Thanks
						<a
							href="https://github.com/ClassicOldSong"
							target="_blank"
							rel="noopener noreferrer"
						>
							ClassicOldSong
						</a>.
					</li>
					<li>
						<strong>Bugfix</strong> - Stop screenlog.js from showing up in the
						exported HTML.
					</li>
					<li>
						Popular external libraries list updated. Thanks
						<a
							href="https://github.com/jlapitan"
							target="_blank"
							rel="noopener noreferrer"
						>
							jlapitan
						</a>.
					</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.9.4</span>
				<ul>
					<li>
						<strong>Improvement</strong>: Atomic CSS (Atomizer) has been updated
						to latest version. Now you can do things like psuedo elements. Learn
						More.
					</li>
					<li>
						<strong>Bugfix</strong> - Logging circular objects is now possible.
						It won't show in the Web Maker console, but will show fine in
						browser's console.
					</li>
					<li>
						<strong>Bugfix</strong> - Console's z-index issue has been fixed.
					</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.9.3</span>
				<ul>
					<li>
						Choose the save location while exporting your saved creations. Now
						easily sync them to your Dropbox or any cloud storage.
					</li>
					<li>All modals inside the app now have a close button.</li>
					<li>
						Checkbox that showed on clicking a boolean value is now removed.
						Thanks
						<a
							href="https://github.com/gauravmuk"
							target="_blank"
							rel="noopener noreferrer"
						>
							Gaurav Nanda
						</a>.
					</li>
					<li>
						<strong>Bugfix</strong> - Screenshots on retina device are now
						correct. Thanks
						<a
							href="https://github.com/AshBardhan"
							target="_blank"
							rel="noopener noreferrer"
						>
							Ashish Bardhan
						</a>.
					</li>
					<li>
						<strong>Bugfix</strong> - Double console log in detached mode fixed.
					</li>
					<li>
						<strong>Bugfix</strong> - Console.clear now works in detached mode
						too.
					</li>
					<li>
						<strong>Bugfix</strong> - DOCTYPE added in preview.
					</li>
					<li>
						<strong>Bugfix</strong> - Typo correction in README. Thanks
						<a
							href="https://github.com/AdilMah"
							target="_blank"
							rel="noopener noreferrer"
						>
							Adil Mahmood
						</a>.
					</li>
					<li>gstatic.com is available to load external JavaScripts from.</li>
					<li>
						Popular libraries list updated. Thanks
						<a
							href="https://github.com/diomed"
							target="_blank"
							rel="noopener noreferrer"
						>
							diomed
						</a>.
					</li>
					<li>
						Added
						<a
							href="https://github.com/chinchang/web-maker/blob/master/CONTRIBUTING.md"
							target="_blank"
							rel="noopener noreferrer"
						>
							contribution guidelines
						</a>{' '}
						in the Github repository.
					</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.9.2</span>
				<ul>
					<li>Minor bug fixes.</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.9.1</span>
				<ul>
					<li>
						<a
							href="https://medium.com/web-maker/v2-9-lots-of-goodies-bd1e939571f6"
							target="_blank"
							rel="noopener noreferrer"
						>
							Read blog post about last release.
						</a>
					</li>
					<li>
						Use Ctrl/Cmd+D to select next occurence of matching selection.
					</li>
					<li>Improve onboard experience.</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.9.0</span>
				<ul>
					<li>
						<a
							href="https://medium.com/web-maker/v2-9-lots-of-goodies-bd1e939571f6"
							target="_blank"
							rel="noopener noreferrer"
						>
							Read blog post about this release.
						</a>
					</li>
					<li>
						<strong>Detached Preview</strong> - Yes, you read that correct! You
						can now detach your preview and send it to your secondary monitor.
					</li>
					<li>
						<strong>Find & Replace</strong> - Long awaited, now its there.
						Ctrl/Cmd+f to find and add Alt to replace.
					</li>
					<li>
						<strong>Atomic CSS (Atomizer) configurations</strong> - Add custom
						config for Atomic CSS.
						<a
							href="https://github.com/acss-io/atomizer#api"
							target="_blank"
							rel="noopener noreferrer"
						>
							Read more
						</a>.
					</li>
					<li>
						<strong>Light mode</strong> - This new setting makes Web Maker drop
						some heavy effects like blur etc to gain more performance. Thanks
						<a
							href="https://github.com/iamandrewluca"
							target="_blank"
							rel="noopener noreferrer"
						>
							Andrew
						</a>.
					</li>
					<li>
						<strong>Preserve logs setting</strong> - Choose whether or not to
						preserve logs across preview refreshes. Thanks
						<a
							href="https://github.com/BasitAli"
							target="_blank"
							rel="noopener noreferrer"
						>
							Basit
						</a>.
					</li>
					<li>
						<strong>Line wrap setting</strong> - As the name says.
					</li>
					<li>Semantic UI added to popular libraries.</li>
					<li>
						Bootstrap, Vue, UI-Kit and more updated to latest versions in
						popular libraries.
					</li>
					<li>UX improvements in settings UI</li>

					<li>
						<strong>Bugfix</strong> - Trigger preview refresh anytime with
						Ctrl/⌘ + Shift + 5. Even with auto-preview on.
					</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.8.1</span>
				<ul>
					<li>
						Vue.js & UIKit version updated to latest version in 'Add Library'
						list.
					</li>
					<li>
						UTF-8 charset added to preview HTML to support universal characters.
					</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.8.0</span>
				<ul>
					<li>
						<a
							href="https://medium.com/web-maker/release-v2-8-is-out-f44e6ea5d9c4"
							target="_blank"
							rel="noopener noreferrer"
						>
							Read blog post about this release.
						</a>
					</li>
					<li>
						<strong>Auto Save</strong> - Your creations now auto-save after your
						first manual save. This is configurable from settings.
					</li>
					<li>
						<strong>Base2Tone-Meadow Editor Theme</strong> - First user
						contributed theme. Thanks to Diomed.
					</li>
					<li>
						<strong>Use System Fonts</strong> - You can now use any of your
						existing system fonts in the editor!
					</li>
					<li>
						<strong>Matching Tag Highlight</strong> - Cursor over any HTML tag
						would highlight the matching pair tag.
					</li>
					<li>
						Auto-completion suggestion can now be switched off from settings.
					</li>
					<li>
						<strong>Improvement</strong> - Stop white flicker in editor when the
						app opens.
					</li>
					<li>
						<strong>Bugfix</strong> - Add Babel Polyfill to enable use of
						next-gen built-ins like Promise or WeakMap.
					</li>
					<li>Vue.js version updated to 2.4.0 in popular library list.</li>
					<li>
						Downloads permission is optional. Asked only when you take
						screenshot.
					</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.7.2</span>
				<ul>
					<li>
						<strong>External Libraries</strong> - Add Foundation.js and update
						UIKit 3 to latest beta.
					</li>
					<li>
						<strong>rawgit.com</strong> &
						<strong>wzrd.in</strong> domains are now allowed for loading
						external libraries from.
					</li>
					<li>Minor booting speed improvements</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.7.1</span>
				<ul>
					<li>
						<strong>Framer.js support</strong> - You can now load the latest
						framer.js library from
						<a
							href="https://builds.framerjs.com/"
							target="_blank"
							rel="noopener noreferrer"
						>
							framer builds page
						</a>{' '}
						and start coding framer prototypes.
					</li>
					<li>
						<strong>Bugfix</strong>: Edit on CodePen is back in action.
					</li>
					<li>
						<strong>Bugfix</strong>: Autocompletion menu doesn't show on cut and
						paste now.
					</li>
					<li>
						<strong>Bugfix</strong>: Updated & fixed urls of some common
						external libraries to latest versions. UIKit3 & Bootstrap 4α are now
						in the list.
					</li>
					<li>Preprocessor selector are now more accessible.</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.7.0</span>
				<ul>
					<li>
						<strong>Fork any creation!</strong>: Now you can fork any existing
						creation of yours to start a new work based on it. One big use case
						of this feature is "Templates"!
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://kushagragour.in/blog/2017/05/web-maker-fork-templates/?utm_source=webmakerapp&utm_medium=referral"
						>
							Read more about it
						</a>.
					</li>
					<li>
						<strong>Fonts 😍 </strong>: Super-awesome 4 fonts (mostly with
						ligature support) now available to choose from. Fira Code is the
						default font now.
					</li>
					<li>Updated most used external libraries to latest versions.</li>
					<li>
						<strong>Bugfix</strong>: Add missing Bootstrap JS file to most used
						external libraries list.
					</li>
					<li>
						Several other minor bugfixes and improvements to make Web Maker
						awesome!
					</li>

					<li>
						Great news to share with you - Web Maker has been featured on the
						Chrome Webstore homepage! Thanks for all the love :)
					</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.6.1</span>
				<ul>
					<li>
						<strong>Bugfix</strong>: Emojis vanishing while exporting to Codepen
						has been fixed.
					</li>
					<li>
						<strong>Bugfix</strong>:
						<code>console.clear()</code> now doesn't error and clears the
						inbuilt console.
					</li>
					<li>
						<strong>Bugfix</strong>: External libraries added to the creation
						are exported as well to Codepen.
					</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.6.0</span>
				<ul>
					<li>
						<strong>The "Console"</strong>: The most awaited feature is here!
						There is now an inbuilt console to see your logs, errors and for
						quickly evaluating JavaScript code inside your preview. Enjoy! I
						also a
						<a
							href="https://kushagragour.in/blog/2017/05/web-maker-console-is-here/?utm_source=webmakerapp&utm_medium=referral"
							target="_blank"
							rel="noopener noreferrer"
						>
							blog post about it
						</a>.
					</li>
					<li>
						Number slider which popped on clicking any number in the code has
						been removed due to poor user experience.
					</li>
					<li>Minor usability improvements.</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.5.0</span>
				<ul>
					<li>
						<strong>Atomic CSS</strong>: Use can now use Atomic CSS(ACSS) in
						your work!
						<a
							href="https://acss.io/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Read more about it here
						</a>.
					</li>
					<li>
						<strong>Search your saved creations</strong>: Easily search through
						all your saved creations by title.
					</li>
					<li>
						<strong>Configurable Auto-preview</strong> - You can turn off the
						auto preview in settings if you don't want the preview to update as
						you type.
					</li>
					<li>
						<strong>Configurable refresh on resize</strong> - You can configure
						whether you want the preview to refresh when you resize the preview
						panel.
					</li>
					<li>
						<strong>Bugfix</strong> - Fix indentation
						<a
							href="https://github.com/chinchang/web-maker/issues/104"
							target="_blank"
							rel="noopener noreferrer"
						>
							issue
						</a>{' '}
						with custom indentation size.
					</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.4.2</span>
				<ul>
					<li>
						<strong>Improved infinite loop protection</strong>: Infinite loop
						protection is now faster and more reliable. And works without the
						need of Escodegen. Thanks to Ariya Hidayat!
					</li>
					<li>
						<strong>Bugfix</strong> - Default parameters not working in
						JavaScript is fixed.
					</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.4.0</span>
				<ul>
					<li>
						<strong>Import/Export</strong>: Your creations are most important.
						Now export all your creations into a single file as a backup that
						can be imported anytime & anywhere.
					</li>
					<li>
						<strong>Editor themes</strong>: You have been heard. Now you can
						choose from a huge list of wonderful editor themes!
					</li>
					<li>
						<strong>Identation settings</strong>: Not a spaces fan? Switch to
						tabs and set your indentation size.
					</li>
					<li>
						<strong>Vim key bindings</strong>: Rejoice Vim lovers!
					</li>
					<li>
						<strong>Code blast</strong>: Why don't you try coding with this
						switched on from the settings? Go on...
					</li>
					<li>
						<strong>Important</strong>: Due to security policy changes from
						Chrome 57 onwards, Web Maker now allows loading external JavaScript
						libraries only from certain whitelisted domains (localhost,
						https://ajax.googleapis.com, https://code.jquery.com,
						https://cdnjs.cloudflare.com, https://unpkg.com, https://maxcdn.com,
						https://cdn77.com, https://maxcdn.bootstrapcdn.com,
						https://cdn.jsdelivr.net/)
					</li>
					<li>Save button now highlights when you have unsaved changes.</li>
					<li>Jade is now called Pug. Just a name change.</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.3.2</span>
				<ul>
					<li>Update Babel to support latest and coolest ES6 features.</li>
					<li>Improve onboarding experience at first install.</li>
				</ul>
			</div>
			<div class="notification">
				<span class="notification__version">2.3.1</span>
				<ul>
					<li>
						<strong>Bugfix</strong> - Splitting of code and preview panes is
						remembered by the editor.
					</li>
					<li>
						Title of the creation is used for the file name when saving as HTML.
					</li>
				</ul>
			</div>
			<div class="notification">
				<span class="notification__version">2.3.0</span>
				<ul>
					<li>
						<strong>Add Library Autocompletion</strong> - Just start typing the
						name of library and you'll be shown matching libraries from cdnjs.
					</li>
					<li>
						<strong>Preview Screenshot Capture</strong> - Want to grab a nice
						screenshot of your creation. You have it! Click and capture.
					</li>
					<li>
						<strong>Auto Indent Code</strong> - Select your code and hit
						Shift-Tab to auto-indent it!
					</li>
					<li>
						<strong>Keyboard Navigation in Saved List</strong> - Now select your
						creation using arrow keys and hit ENTER to open it.
					</li>
					<li>Highlight active line in code panes.</li>
					<li>
						<strong>Bugfix</strong> - Fix in generated title of new creation.
					</li>
					<li>
						<strong>Bugfix</strong> - HTML autocompletion is manual triggered
						now with Ctrl+Space.
					</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.2.0</span>
				<ul>
					<li>
						<strong>Code Autocompletion</strong> - See code suggestions while
						you type!
					</li>
					<li>
						<strong>Full Screen Preview</strong> - Checkout your creation in a
						full-screen layout.
					</li>
					<li>
						<strong>SASS</strong> - SASS support added for CSS.
					</li>
					<li>
						<strong>Faster CSS update</strong> - Preview updates instantly
						without refresh when just CSS is changed.
					</li>
					<li>
						<strong>Bugfix</strong> - Indentation fixed while going on new line.
					</li>
					<li>
						<strong>Bugfix</strong> - Works even in Chrome Canary now. Though
						libraries can be added only through CDNs.
					</li>
				</ul>
			</div>

			<div class="notification">
				<span class="notification__version">2.1.0</span>
				<ul>
					<li>
						<strong>TypeScript</strong> - Now you can code in TypeScript too!
					</li>
					<li>
						<strong>Stylus Preprocessor</strong> - Stylus supported adding for
						CSS.
					</li>
					<li>
						<strong>Code Folding</strong> - Collapse large code blocks for easy
						editing.
					</li>
					<li>
						<strong>Bugfix</strong> - Support JSX in JavaScript.
					</li>
					<li>Better onboarding for first time users.</li>
				</ul>
			</div>
			<div class="notification">
				<span class="notification__version">2.0.0</span>
				<ul>
					<li>
						<strong>Save and Load</strong> - Long pending and super-useful, now
						you can save your creations and resume them anytime later.
					</li>
					<li>
						<strong>Insert JS & CSS</strong> - Load popular JavaScript & CSS
						libraries in your work without writing any code.
					</li>
					<li>
						<strong>Collapsed Panes</strong> - Collapse/uncollapse code panes
						with a single click. Your pane configuration is even saved with
						every creation!
					</li>
					<li>
						<strong>Quick color & number change</strong> - Click on any color or
						number and experiment with quick values using a slider.
					</li>
					<li>
						<strong>Linting</strong> - See your code errors right where you are
						coding.
					</li>
					<li>No more browser hang due to infinite loops!</li>
				</ul>
			</div>
			<div class="notification">
				<span class="notification__version">1.7.0</span>
				<ul>
					<li>
						<strong>Preprocessors!</strong> - Enjoy a whole list of
						preprocessors for HTML(Jade & markdown), CSS(SCSS & LESS) and
						JavaScript(CoffeeScript & Babel).
					</li>
					<li>More awesome font for code.</li>
				</ul>
			</div>
			<div class="notification">
				<span class="notification__version">1.6.0</span>
				<ul>
					<li>
						You can now configure Web-Maker to not replace new tab page from the
						settings. It is always accessible from the icon in the top-right.
					</li>
					<li>
						Download current code as HTML file with Ctrl/⌘ + S keyboard
						shortcut.
					</li>
					<li>
						New notifications panel added so you are always aware of the new
						changes in Web-Maker.
					</li>
				</ul>
			</div>
		</div>
	);
}
