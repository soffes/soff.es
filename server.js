const express = require('express')
const next = require('next')
const { join } = require('path')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const redirects = [
  { from: '/music', to: 'https://soundcloud.com/soffes' },
  { from: '/talks', to: 'https://speakerdeck.com/soffes' },
  { from: '/resume', to: 'https://github.com/soffes/resume/blob/master/Sam%20Soffes%20Resume.pdf?raw=true' },
  { from: '/clock', to: 'https://github.com/soffes/clock-saver' },
  { from: '/blog', to: 'https://soffes.blog' },

  { from: '/the-motorola-rokr', to: 'https://soffes.blog/the-motorola-rokr' },
  { from: '/ipod-scare', to: 'https://soffes.blog/ipod-scare' },
  { from: '/apple-boot-camp-public-beta1', to: 'https://soffes.blog/apple-boot-camp-public-beta1' },
  { from: '/quote-of-the-week', to: 'https://soffes.blog/quote-of-the-week' },
  { from: '/quote-of-the-week-2', to: 'https://soffes.blog/quote-of-the-week-2' },
  { from: '/new-bravia-video', to: 'https://soffes.blog/new-bravia-video' },
  { from: '/web-20-look-coming', to: 'https://soffes.blog/web-20-look-coming' },
  { from: '/wwdc-2006-and-new-at-apple', to: 'https://soffes.blog/wwdc-2006-and-new-at-apple' },
  { from: '/treo-600', to: 'https://soffes.blog/treo-600' },
  { from: '/facebook-makes-me-smile', to: 'https://soffes.blog/facebook-makes-me-smile' },
  { from: '/idvd-6-awesome-crap', to: 'https://soffes.blog/idvd-6-awesome-crap' },
  { from: '/new-get-a-mac-ads', to: 'https://soffes.blog/new-get-a-mac-ads' },
  { from: '/using-garageband-as-a-guitar-pedal', to: 'https://soffes.blog/using-garageband-as-a-guitar-pedal' },
  { from: '/i-got-accepted-to-taylor-university', to: 'https://soffes.blog/i-got-accepted-to-taylor-university' },
  { from: '/my-quote-of-the-week-4', to: 'https://soffes.blog/my-quote-of-the-week-4' },
  { from: '/my-quote-of-the-week-3', to: 'https://soffes.blog/my-quote-of-the-week-3' },
  { from: '/why-i-click-google-ads', to: 'https://soffes.blog/why-i-click-google-ads' },
  { from: '/my-quote-of-the-week-2', to: 'https://soffes.blog/my-quote-of-the-week-2' },
  { from: '/quote-of-the-week-3', to: 'https://soffes.blog/quote-of-the-week-3' },
  { from: '/famous-quote-of-the-week', to: 'https://soffes.blog/famous-quote-of-the-week' },
  { from: '/apple-is-amazing', to: 'https://soffes.blog/apple-is-amazing' },
  { from: '/my-quote-of-the-week', to: 'https://soffes.blog/my-quote-of-the-week' },
  { from: '/apple-slaps-vista-in-the-face', to: 'https://soffes.blog/apple-slaps-vista-in-the-face' },
  { from: '/i-give-up', to: 'https://soffes.blog/i-give-up' },
  { from: '/i-got-an-iphone', to: 'https://soffes.blog/i-got-an-iphone' },
  { from: '/coming-soon', to: 'https://soffes.blog/coming-soon' },
  { from: '/the-oo-page', to: 'https://soffes.blog/the-oo-page' },
  { from: '/sidebar-widgets', to: 'https://soffes.blog/sidebar-widgets' },
  { from: '/internet-explorer-is-stupid', to: 'https://soffes.blog/internet-explorer-is-stupid' },
  { from: '/iphone-update-1-1-1-and-installer-app', to: 'https://soffes.blog/iphone-update-1-1-1-and-installer-app' },
  { from: '/installer-app-on-iphone-1-1-1-finally', to: 'https://soffes.blog/installer-app-on-iphone-1-1-1-finally' },
  { from: '/logic-pro-studio-is-awesome', to: 'https://soffes.blog/logic-pro-studio-is-awesome' },
  { from: '/goodbye-codeigniter-hello-expressionenginer', to: 'https://soffes.blog/goodbye-codeigniter-hello-expressionenginer' },
  { from: '/xbox-360-and-hd-tv', to: 'https://soffes.blog/xbox-360-and-hd-tv' },
  { from: '/new-design-coming-soon-with-sifr', to: 'https://soffes.blog/new-design-coming-soon-with-sifr' },
  { from: '/lets-end-the-browser-war-and-just-comply-with-standards', to: 'https://soffes.blog/lets-end-the-browser-war-and-just-comply-with-standards' },
  { from: '/i-love-panic', to: 'https://soffes.blog/i-love-panic' },
  { from: '/ie-firefox-why-would-you-want-this', to: 'https://soffes.blog/ie-firefox-why-would-you-want-this' },
  { from: '/my-name-is-kevin-smith-only-at-gamestop-though', to: 'https://soffes.blog/my-name-is-kevin-smith-only-at-gamestop-though' },
  { from: '/google-is-awesome', to: 'https://soffes.blog/google-is-awesome' },
  { from: '/life-updates', to: 'https://soffes.blog/life-updates' },
  { from: '/new-contact-information', to: 'https://soffes.blog/new-contact-information' },
  { from: '/data-portability', to: 'https://soffes.blog/data-portability' },
  { from: '/expressionengine-kills-my-pagerank', to: 'https://soffes.blog/expressionengine-kills-my-pagerank' },
  { from: '/social-graph-api', to: 'https://soffes.blog/social-graph-api' },
  { from: '/the-idisk-sucks', to: 'https://soffes.blog/the-idisk-sucks' },
  { from: '/first-countdown-maker-sale', to: 'https://soffes.blog/first-countdown-maker-sale' },
  { from: '/i-am-addicted-to-redoing-my-blog', to: 'https://soffes.blog/i-am-addicted-to-redoing-my-blog' },
  { from: '/yay-for-rss-and-kohana', to: 'https://soffes.blog/yay-for-rss-and-kohana' },
  { from: '/the-experiment', to: 'https://soffes.blog/the-experiment' },
  { from: '/glad-i-chose-programmer-over-musician', to: 'https://soffes.blog/glad-i-chose-programmer-over-musician' },
  { from: '/simple-pagination-and-commenting-ideas', to: 'https://soffes.blog/simple-pagination-and-commenting-ideas' },
  { from: '/3-easy-steps-to-optimize-web-apps-for-iphone', to: 'https://soffes.blog/3-easy-steps-to-optimize-web-apps-for-iphone' },
  { from: '/five-instead-of-four', to: 'https://soffes.blog/five-instead-of-four' },
  { from: '/music-podcast-and-years', to: 'https://soffes.blog/music-podcast-and-years' },
  { from: '/twitter-from-quicksilver', to: 'https://soffes.blog/twitter-from-quicksilver' },
  { from: '/samsoffes', to: 'https://soffes.blog/samsoffes' },
  { from: '/being-19-with-a-career-sucks', to: 'https://soffes.blog/being-19-with-a-career-sucks' },
  { from: '/soundcloud-is-pretty-sweet', to: 'https://soffes.blog/soundcloud-is-pretty-sweet' },
  { from: '/how-to-sync-your-itunes-with-dropbox-in-3-steps', to: 'https://soffes.blog/how-to-sync-your-itunes-with-dropbox-in-3-steps' },
  { from: '/fun-unicode-domains', to: 'https://soffes.blog/fun-unicode-domains' },
  { from: '/video-why-i-love-remember-the-milk', to: 'https://soffes.blog/video-why-i-love-remember-the-milk' },
  { from: '/back-to-wordpress', to: 'https://soffes.blog/back-to-wordpress' },
  { from: '/new-music-to-wait-a-lifetime', to: 'https://soffes.blog/new-music-to-wait-a-lifetime' },
  { from: '/why-a-mac-app-store-would-suck', to: 'https://soffes.blog/why-a-mac-app-store-would-suck' },
  { from: '/eleven-at-night', to: 'https://soffes.blog/eleven-at-night' },
  { from: '/counting-to-infinity', to: 'https://soffes.blog/counting-to-infinity' },
  { from: '/hello-world-again', to: 'https://soffes.blog/hello-world-again' },
  { from: '/iphone-plist-tutorial', to: 'https://soffes.blog/iphone-plist-tutorial' },
  { from: '/linus-torvalds-on-git', to: 'https://soffes.blog/linus-torvalds-on-git' },
  { from: '/openbeta-and-okccoco', to: 'https://soffes.blog/openbeta-and-okccoco' },
  { from: '/my-take-on-using-ruby-on-rails', to: 'https://soffes.blog/my-take-on-using-ruby-on-rails' },
  { from: '/i-dont-have-a-boss-anymore', to: 'https://soffes.blog/i-dont-have-a-boss-anymore' },
  { from: '/moving-to-louisville', to: 'https://soffes.blog/moving-to-louisville' },
  { from: '/scratch-that-im-staying-in-oklahoma-city', to: 'https://soffes.blog/scratch-that-im-staying-in-oklahoma-city' },
  { from: '/why-i-do-not-profit-share', to: 'https://soffes.blog/why-i-do-not-profit-share' },
  { from: '/web-services-with-cocoa-surprise', to: 'https://soffes.blog/web-services-with-cocoa-surprise' },
  { from: '/how-to-tether-iphone-3-0-without-jailbreaking', to: 'https://soffes.blog/how-to-tether-iphone-3-0-without-jailbreaking' },
  { from: '/cocoa-makes-it-easy', to: 'https://soffes.blog/cocoa-makes-it-easy' },
  { from: '/mobilelex-2009', to: 'https://soffes.blog/mobilelex-2009' },
  { from: '/moving-to-dallas', to: 'https://soffes.blog/moving-to-dallas' },
  { from: '/new-blog-on-github-and-jekyll', to: 'https://soffes.blog/new-blog-on-github-and-jekyll' },
  { from: '/i-like-gowalla', to: 'https://soffes.blog/i-like-gowalla' },
  { from: '/iphone-push-development-issues', to: 'https://soffes.blog/iphone-push-development-issues' },
  { from: '/markdownr-com', to: 'https://soffes.blog/markdownr-com' },
  { from: '/parsing-json-with-the-iphones-private-json-framework', to: 'https://soffes.blog/parsing-json-with-the-iphones-private-json-framework' },
  { from: '/iphone-json-benchmarks', to: 'https://soffes.blog/iphone-json-benchmarks' },
  { from: '/easy-deployment-with-heroku', to: 'https://soffes.blog/easy-deployment-with-heroku' },
  { from: '/i-released-an-iphone-push-notification-gem', to: 'https://soffes.blog/i-released-an-iphone-push-notification-gem' },
  { from: '/customize-uikit-with-method-swizzling', to: 'https://soffes.blog/customize-uikit-with-method-swizzling' },
  { from: '/app-store-approval-process', to: 'https://soffes.blog/app-store-approval-process' },
  { from: '/screencast-reuse-code-across-iphone-applications-with-a-static-library-and-git', to: 'https://soffes.blog/screencast-reuse-code-across-iphone-applications-with-a-static-library-and-git' },
  { from: '/running-rails-local-development-with-nginx-postgres-and-passenger-with-homebrew', to: 'https://soffes.blog/running-rails-local-development-with-nginx-postgres-and-passenger-with-homebrew' },
  { from: '/app-store-rejection', to: 'https://soffes.blog/app-store-rejection' },
  { from: '/moved-to-heroku', to: 'https://soffes.blog/moved-to-heroku' },
  { from: '/trying-to-teach-web-development', to: 'https://soffes.blog/trying-to-teach-web-development' },
  { from: '/rejected-for-cleverness', to: 'https://soffes.blog/rejected-for-cleverness' },
  { from: '/what-i-do', to: 'https://soffes.blog/what-i-do' },
  { from: '/old-people-and-the-other-side', to: 'https://soffes.blog/old-people-and-the-other-side' },
  { from: '/hosting-frustrations', to: 'https://soffes.blog/hosting-frustrations' },
  { from: '/archiving-nsmanagedobject-with-nscoding', to: 'https://soffes.blog/archiving-nsmanagedobject-with-nscoding' },
  { from: '/homepage-albums', to: 'https://soffes.blog/homepage-albums' },
  { from: '/new-server-script', to: 'https://soffes.blog/new-server-script' },
  { from: '/wwdc-2010-predictions', to: 'https://soffes.blog/wwdc-2010-predictions' },
  { from: '/two-videos-you-need-to-watch', to: 'https://soffes.blog/two-videos-you-need-to-watch' },
  { from: '/updated-iphone-json-benchmarks', to: 'https://soffes.blog/updated-iphone-json-benchmarks' },
  { from: '/archiving-objective-c-objects-with-nscoding', to: 'https://soffes.blog/archiving-objective-c-objects-with-nscoding' },
  { from: '/hello-internet-iphone-4', to: 'https://soffes.blog/hello-internet-iphone-4' },
  { from: '/hello-internet-old-spice-guy-and-retweet-contests', to: 'https://soffes.blog/hello-internet-old-spice-guy-and-retweet-contests' },
  { from: '/how-to-learn-rails', to: 'https://soffes.blog/how-to-learn-rails' },
  { from: '/hello-internet-pro-apps', to: 'https://soffes.blog/hello-internet-pro-apps' },
  { from: '/sync-your-fonts-with-dropbox-tutorial', to: 'https://soffes.blog/sync-your-fonts-with-dropbox-tutorial' },
  { from: '/hello-internet-iphone-screens', to: 'https://soffes.blog/hello-internet-iphone-screens' },
  { from: '/hello-internet-apple', to: 'https://soffes.blog/hello-internet-apple' },
  { from: '/on-my-own-again', to: 'https://soffes.blog/on-my-own-again' },
  { from: '/thoughts-on-writing-code-for-money', to: 'https://soffes.blog/thoughts-on-writing-code-for-money' },
  { from: '/hello-internet-throwback-mountian-dew', to: 'https://soffes.blog/hello-internet-throwback-mountian-dew' },
  { from: '/web-app-vs-native-app', to: 'https://soffes.blog/web-app-vs-native-app' },
  { from: '/hello-internet-microcell', to: 'https://soffes.blog/hello-internet-microcell' },
  { from: '/hello-internet-the-government', to: 'https://soffes.blog/hello-internet-the-government' },
  { from: '/hello-internet-mac-app-store', to: 'https://soffes.blog/hello-internet-mac-app-store' },
  { from: '/hello-internet-twitter', to: 'https://soffes.blog/hello-internet-twitter' },
  { from: '/why-crazy-column-designs-are-bad', to: 'https://soffes.blog/why-crazy-column-designs-are-bad' },
  { from: '/im-moving-to-san-francisco', to: 'https://soffes.blog/im-moving-to-san-francisco' },
  { from: '/miracles-happen', to: 'https://soffes.blog/miracles-happen' },
  { from: '/shapes-app', to: 'https://soffes.blog/shapes-app' },
  { from: '/some-sstoolkit-additions', to: 'https://soffes.blog/some-sstoolkit-additions' },
  { from: '/52-profiles-video', to: 'https://soffes.blog/52-profiles-video' },
  { from: '/how-to-drastically-improve-your-app-with-an-afternoon-and-instruments', to: 'https://soffes.blog/how-to-drastically-improve-your-app-with-an-afternoon-and-instruments' },
  { from: '/typical-sam', to: 'https://soffes.blog/typical-sam' },
  { from: '/clean-up-your-project', to: 'https://soffes.blog/clean-up-your-project' },
  { from: '/custom-cloud-app-viso', to: 'https://soffes.blog/custom-cloud-app-viso' },
  { from: '/four-years', to: 'https://soffes.blog/four-years' },
  { from: '/moving-on', to: 'https://soffes.blog/moving-on' },
  { from: '/hipstamatic', to: 'https://soffes.blog/hipstamatic' },
  { from: '/compass-and-rails-3-1', to: 'https://soffes.blog/compass-and-rails-3-1' },
  { from: '/notebooks', to: 'https://soffes.blog/notebooks' },
  { from: '/hey-synthetic', to: 'https://soffes.blog/hey-synthetic' },
  { from: '/how-to-rock-at-craigs-list', to: 'https://soffes.blog/how-to-rock-at-craigs-list' },
  { from: '/the-worst-recruiters', to: 'https://soffes.blog/the-worst-recruiters' },
  { from: '/face-detection-at-hipstamatic', to: 'https://soffes.blog/face-detection-at-hipstamatic' },
  { from: '/removed-facebook-comments', to: 'https://soffes.blog/removed-facebook-comments' },
  { from: '/easy-syntax-highlighting', to: 'https://soffes.blog/easy-syntax-highlighting' },
  { from: '/make-ichat-better', to: 'https://soffes.blog/make-ichat-better' },
  { from: '/genius-launch', to: 'https://soffes.blog/genius-launch' },
  { from: '/how-to-install-ruby-193', to: 'https://soffes.blog/how-to-install-ruby-193' },
  { from: '/my-deploy-script', to: 'https://soffes.blog/my-deploy-script' },
  { from: '/open-source-is-rewarding', to: 'https://soffes.blog/open-source-is-rewarding' },
  { from: '/always-initialize-to-nil', to: 'https://soffes.blog/always-initialize-to-nil' },
  { from: '/uitableviewcell-silly-magic', to: 'https://soffes.blog/uitableviewcell-silly-magic' },
  { from: '/on-managing-money', to: 'https://soffes.blog/on-managing-money' },
  { from: '/automatic-reference-counting', to: 'https://soffes.blog/automatic-reference-counting' },
  { from: '/constantly-changing', to: 'https://soffes.blog/constantly-changing' },
  { from: '/here-we-go-again', to: 'https://soffes.blog/here-we-go-again' },
  { from: '/hello-internet-selling-my-stuff', to: 'https://soffes.blog/hello-internet-selling-my-stuff' },
  { from: '/image-optimization-on-ios', to: 'https://soffes.blog/image-optimization-on-ios' },
  { from: '/introducing-shares', to: 'https://soffes.blog/introducing-shares' },
  { from: '/hire-sam', to: 'https://soffes.blog/hire-sam' },
  { from: '/unjarring-the-responsive-web', to: 'https://soffes.blog/unjarring-the-responsive-web' },
  { from: '/announcing-cheddar', to: 'https://soffes.blog/announcing-cheddar' },
  { from: '/the-industry-podcast-8', to: 'https://soffes.blog/the-industry-podcast-8' },
  { from: '/rubymotion-review', to: 'https://soffes.blog/rubymotion-review' },
  { from: '/progress-in-ios', to: 'https://soffes.blog/progress-in-ios' },
  { from: '/cheddar-lessons-so-far', to: 'https://soffes.blog/cheddar-lessons-so-far' },
  { from: '/google-knowledge-graph', to: 'https://soffes.blog/google-knowledge-graph' },
  { from: '/ruby-in-the-browser', to: 'https://soffes.blog/ruby-in-the-browser' },
  { from: '/sass-vs-less', to: 'https://soffes.blog/sass-vs-less' },
  { from: '/sspulltorefresh', to: 'https://soffes.blog/sspulltorefresh' },
  { from: '/strapless-ipod-nano-watch', to: 'https://soffes.blog/strapless-ipod-nano-watch' },
  { from: '/the-balance', to: 'https://soffes.blog/the-balance' },
  { from: '/zendesk-careers-video', to: 'https://soffes.blog/zendesk-careers-video' },
  { from: '/webkit-css-variables', to: 'https://soffes.blog/webkit-css-variables' },
  { from: '/why-the-facebook-ipo-matters', to: 'https://soffes.blog/why-the-facebook-ipo-matters' },
  { from: '/coda-2', to: 'https://soffes.blog/coda-2' },
  { from: '/pulp-25', to: 'https://soffes.blog/pulp-25' },
  { from: '/having-less', to: 'https://soffes.blog/having-less' },
  { from: '/part-of-rubymotion-open-sourced', to: 'https://soffes.blog/part-of-rubymotion-open-sourced' },
  { from: '/my-grid-system', to: 'https://soffes.blog/my-grid-system' },
  { from: '/using-people', to: 'https://soffes.blog/using-people' },
  { from: '/dealing-with-emoji', to: 'https://soffes.blog/dealing-with-emoji' },
  { from: '/learn-ios', to: 'https://soffes.blog/learn-ios' },
  { from: '/staying-strong', to: 'https://soffes.blog/staying-strong' },
  { from: '/yammer-sells-for-12-billon', to: 'https://soffes.blog/yammer-sells-for-12-billon' },
  { from: '/developer-and-designer', to: 'https://soffes.blog/developer-and-designer' },
  { from: '/dont-censor-me', to: 'https://soffes.blog/dont-censor-me' },
  { from: '/boredom-and-change', to: 'https://soffes.blog/boredom-and-change' },
  { from: '/ask-me-something-about-cheddar', to: 'https://soffes.blog/ask-me-something-about-cheddar' },
  { from: '/scaling-cheddar', to: 'https://soffes.blog/scaling-cheddar' },
  { from: '/founders-talk-interview', to: 'https://soffes.blog/founders-talk-interview' },
  { from: '/behind-cheddars-server', to: 'https://soffes.blog/behind-cheddars-server' },
  { from: '/hello-internet-nexus-7', to: 'https://soffes.blog/hello-internet-nexus-7' },
  { from: '/acquisitions', to: 'https://soffes.blog/acquisitions' },
  { from: '/those-were-the-days', to: 'https://soffes.blog/those-were-the-days' },
  { from: '/how-to-learn', to: 'https://soffes.blog/how-to-learn' },
  { from: '/retiring-at-25', to: 'https://soffes.blog/retiring-at-25' },
  { from: '/the-tech-block-podcast-73112', to: 'https://soffes.blog/the-tech-block-podcast-73112' },
  { from: '/founders-talk-part-1', to: 'https://soffes.blog/founders-talk-part-1' },
  { from: '/wrangling-svgs', to: 'https://soffes.blog/wrangling-svgs' },
  { from: '/one-thousand-dollars-an-hour', to: 'https://soffes.blog/one-thousand-dollars-an-hour' },
  { from: '/founders-talk-part-2', to: 'https://soffes.blog/founders-talk-part-2' },
  { from: '/app-net-is-dreaming-small', to: 'https://soffes.blog/app-net-is-dreaming-small' },
  { from: '/the-east-wing', to: 'https://soffes.blog/the-east-wing' },
  { from: '/developer-id-and-10-8', to: 'https://soffes.blog/developer-id-and-10-8' },
  { from: '/testing-retina-graphics-with-resolutiontab', to: 'https://soffes.blog/testing-retina-graphics-with-resolutiontab' },
  { from: '/a-good-talk-show-episode-1', to: 'https://soffes.blog/a-good-talk-show-episode-1' },
  { from: '/reverse-minimalism', to: 'https://soffes.blog/reverse-minimalism' },
  { from: '/changes', to: 'https://soffes.blog/changes' },
  { from: '/founders-talk-part-3', to: 'https://soffes.blog/founders-talk-part-3' },
  { from: '/ship-it', to: 'https://soffes.blog/ship-it' },
  { from: '/mac-app-store', to: 'https://soffes.blog/mac-app-store' },
  { from: '/superconf', to: 'https://soffes.blog/superconf' },
  { from: '/introducing-quesadilla', to: 'https://soffes.blog/introducing-quesadilla' },
  { from: '/hello-world', to: 'https://soffes.blog/hello-world' },
  { from: '/new-blog', to: 'https://soffes.blog/new-blog' },
  { from: '/ipad-stylus-review', to: 'https://soffes.blog/ipad-stylus-review' },
  { from: '/sublime-text-configuration', to: 'https://soffes.blog/sublime-text-configuration' },
  { from: '/springboard-episode-3', to: 'https://soffes.blog/springboard-episode-3' },
  { from: '/how-to-build-a-ruby-gem', to: 'https://soffes.blog/how-to-build-a-ruby-gem' },
  { from: '/how-i-design-for-ios', to: 'https://soffes.blog/how-i-design-for-ios' },
  { from: '/why-i-dont-use-interface-builder', to: 'https://soffes.blog/why-i-dont-use-interface-builder' },
  { from: '/my-dna', to: 'https://soffes.blog/my-dna' },
  { from: '/engagement', to: 'https://soffes.blog/engagement' },
  { from: '/wwdc-2013-predictions', to: 'https://soffes.blog/wwdc-2013-predictions' },
  { from: '/space', to: 'https://soffes.blog/space' },
  { from: '/new-homepage', to: 'https://soffes.blog/new-homepage' },
  { from: '/polish', to: 'https://soffes.blog/polish' },
  { from: '/parting-ways-with-cheddar', to: 'https://soffes.blog/parting-ways-with-cheddar' },
  { from: '/tearing-up-the-carpet', to: 'https://soffes.blog/tearing-up-the-carpet' },
  { from: '/making-roon-faster', to: 'https://soffes.blog/making-roon-faster' },
  { from: '/sleep-schedule', to: 'https://soffes.blog/sleep-schedule' },
  { from: '/setting-up-open-source-and-live-coding-part-1', to: 'https://soffes.blog/setting-up-open-source-and-live-coding-part-1' },
  { from: '/setting-up-open-source-and-live-coding-part-2', to: 'https://soffes.blog/setting-up-open-source-and-live-coding-part-2' },
  { from: '/everlapse', to: 'https://soffes.blog/everlapse' },
  { from: '/fat', to: 'https://soffes.blog/fat' },
  { from: '/onward', to: 'https://soffes.blog/onward' },
  { from: '/founders-talk-part-4', to: 'https://soffes.blog/founders-talk-part-4' },
  { from: '/shares-2', to: 'https://soffes.blog/shares-2' },
  { from: '/motivation', to: 'https://soffes.blog/motivation' },
  { from: '/picking-good-clients', to: 'https://soffes.blog/picking-good-clients' },
  { from: '/snapchat', to: 'https://soffes.blog/snapchat' },
  { from: '/tin-can', to: 'https://soffes.blog/tin-can' },
  { from: '/custom-controls-in-footage', to: 'https://soffes.blog/custom-controls-in-footage' },
  { from: '/raising-your-profile', to: 'https://soffes.blog/raising-your-profile' },
  { from: '/does-free-diminish-value', to: 'https://soffes.blog/does-free-diminish-value' },
  { from: '/valio-con-2013', to: 'https://soffes.blog/valio-con-2013' },
  { from: '/coins', to: 'https://soffes.blog/coins' },
  { from: '/happy-monday', to: 'https://soffes.blog/happy-monday' },
  { from: '/the-east-wing-part-3', to: 'https://soffes.blog/the-east-wing-part-3' },
  { from: '/how-to-hold-a-pencil', to: 'https://soffes.blog/how-to-hold-a-pencil' },
  { from: '/parting-ways-with-execute-ios', to: 'https://soffes.blog/parting-ways-with-execute-ios' },
  { from: '/ios-resources', to: 'https://soffes.blog/ios-resources' },
  { from: '/sstoolkit-2-0', to: 'https://soffes.blog/sstoolkit-2-0' },
  { from: '/twenty-five', to: 'https://soffes.blog/twenty-five' },
  { from: '/coins-for-android', to: 'https://soffes.blog/coins-for-android' },
  { from: '/apple-developer-tools', to: 'https://soffes.blog/apple-developer-tools' },
  { from: '/litely', to: 'https://soffes.blog/litely' },
  { from: '/the-mother-futon-news', to: 'https://soffes.blog/the-mother-futon-news' },
  { from: '/quantum-data-teleportation', to: 'https://soffes.blog/quantum-data-teleportation' },
  { from: '/swift', to: 'https://soffes.blog/swift' },
  { from: '/four-questions', to: 'https://soffes.blog/four-questions' },
  { from: '/value-of-beta', to: 'https://soffes.blog/value-of-beta' },
  { from: '/questions-part-2', to: 'https://soffes.blog/questions-part-2' },
  { from: '/personal-sam', to: 'https://soffes.blog/personal-sam' },
  { from: '/nsregularexpression-notes', to: 'https://soffes.blog/nsregularexpression-notes' },
  { from: '/desk-headphones', to: 'https://soffes.blog/desk-headphones' },
  { from: '/redacted-for-mac-launch', to: 'https://soffes.blog/redacted-for-mac-launch' },
  { from: '/automatic-ui-updates-with-value-types', to: 'https://soffes.blog/automatic-ui-updates-with-value-types' },
  { from: '/syntaxkit', to: 'https://soffes.blog/syntaxkit' },
  { from: '/network-testing-in-swift-with-dvr', to: 'https://soffes.blog/network-testing-in-swift-with-dvr' },
  { from: '/string-homogeneousness', to: 'https://soffes.blog/string-homogeneousness' },
  { from: '/nerd-blog', to: 'https://soffes.blog/nerd-blog' },
  { from: '/static', to: 'https://soffes.blog/static' },
  { from: '/what-color-is-it', to: 'https://soffes.blog/what-color-is-it' },
  { from: '/automated-bundle-version', to: 'https://soffes.blog/automated-bundle-version' },
  { from: '/widest-roman-prime', to: 'https://soffes.blog/widest-roman-prime' },
  { from: '/mic-setup', to: 'https://soffes.blog/mic-setup' }
]

app.prepare().then(() => {
  const server = express()

  redirects.forEach(({ from, to, type = 301, method = 'get' }) => {
    server[method](from, (req, res) => {
      res.redirect(type, to)
    })
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, err => {
    if (err) {
      throw err
    }
    console.log('> Ready on http://localhost:3000')
  })
})