if (localStorage) {
  // Setup Intercom settings
  ;(function() {
    if (localStorage.intercomSettings) {
      window.intercomSettings = JSON.parse(localStorage.intercomSettings)
    } else {
      var user_id = "" + Math.floor(Math.random() * 10000000000)
      window.intercomSettings = {
        app_id: "kwwoj0et",
        user_id: user_id,
        email: "unknown" + user_id + "@davidxmoody.com",
        created_at: Math.floor(Date.now() / 1000),
        version: "0.0.1",
        test_user: window.hostname === "localhost"
      }
      localStorage.intercomSettings = JSON.stringify(window.intercomSettings)
    }
  })()

  // Intercom tracking script (async)
  ;(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/kwwoj0et';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()

  // Track page view
  ;(function() {
    var tryPageView = function() {
      if (!window.Intercom) setTimeout(tryPageView, 500)

      var slug = window.location.pathname.replace(/^\/|\/$/g, "").replace(/[^a-zA-Z0-9-]/g, "_") || "homepage"
      window.Intercom("trackEvent", "view__" + slug, {
        viewed_at: Math.floor(Date.now() / 1000),
        href: window.location.href
      })
    }
    tryPageView()
  })()
}
