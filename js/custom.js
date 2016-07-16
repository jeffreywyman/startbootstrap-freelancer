const socialLinks = [{
    name: "Facebook",
    url: "https://facebook.com/",
    label: "facebook.com/",
    icon: "fa-facebook",
    simplaId: "facebook"
},
{
    name: "Google+",
    url: "https://plus.google.com/",
    label: "plus.google.com/",
    icon: "fa-google-plus",
    simplaId: "google-plus"
},
{
    name: "Twitter",
    url: "https://twitter.com/",
    label: "twitter.com/",
    icon: "fa-twitter",
    simplaId: "twitter"
},
{
    name: "LinkedIn",
    url: "https://linkedin.com/",
    label: "linkedin.com/",
    icon: "fa-linkedin",
    simplaId: "linkedin"
},
{
    name: "Dribbble",
    url: "https://dribbble.com/",
    label: "dribbble.com/",
    icon: "fa-dribbble",
    simplaId: "dribbble"
}];

// settings panel
var panel;

// when we go into edit mode
Simpla.observe('editing', function(editing) {
    if(editing) {
        showSettings();
    } else {
        hideSettings();
        // update urls in social links
        drawSocialLinks();
    }
});

function hideSettings() {
    if (typeof panel != 'undefined') {
        panel.remove();
    }
}

function showSettings() {
    // configure the panel
    panel = $('<div/>')
                    .addClass('edit-tools col-lg-2')
                    .appendTo('body');

    $('<h2/>').text('Page Settings').appendTo(panel);


    // Can't open modals from links containing
    // Simpla images, so just show a list of
    // anchors here to open the modals for editing.
    $('<h3/>').text('Popups').appendTo(panel);
    
    var modalLinks = $('<ul/>')
                        .appendTo(panel);

    for (var i=1; i<=6; i++) {
        var li = $('<li/>')
                    .appendTo(modalLinks);

        $('<a/>')
            .attr('href', '#portfolioModal' + i)
            .attr('data-toggle', 'modal')
            .text("Popup #" + i)
            .appendTo(li);
    }


    $('<h3/>').text('Social Links').appendTo(panel);

    $('<div/>')
        .addClass('form-inline')
        .appendTo(panel);

    var socialSettings = $('<div/>')
                            .addClass('form-group')
                            .appendTo(panel);

    // configre the inputs
    for (i in socialLinks) {
        const social = socialLinks[i];

        Simpla.get(social.simplaId).then(function(res) {
            if (Simpla.getState().editing) {
                // create the input for the settings panel
                var div = $('<div/>')
                            .addClass('form-group')
                            .appendTo(socialSettings);

                var label = $('<label/>')
                                .attr('for', social.simplaId)
                                .text(social.label)
                                .appendTo(div);

                var input = $('<input/>')
                            .addClass('form-control')
                            .val(res.text)
                            .attr('placeholder', social.name)
                            .appendTo(div)
                            // TODO  this is lazy saving, should
                            //       only save if value is changed
                            .blur(function(e) {
                                Simpla.set(social.simplaId, {
                                    text: e.target.value
                                }).then(function() {
                                    console.log('Updated', social.simplaId, e.target.value);
                                }).catch(function() {
                                    console.log("Failed", social.simplaId);
                                });
                            });
            }
        });
    }
}

function drawSocialLinks() {
    // remove any existing links
    $('#social-links li').remove();

    for (i in socialLinks) {
        const social = socialLinks[i];

        Simpla.get(social.simplaId).then(function(res) {
            if (typeof res.text != 'undefined' && res.text.length > 0) {
                var li = $('<li/>')
                            .appendTo($('#social-links'));
                var a = $('<a/>')
                            .attr('href', social.url + res.text)
                            .addClass('btn-social btn-outline')
                            .appendTo(li);
                var i = $('<i/>')
                            .addClass('fa fa-fw')
                            .addClass(social.icon)
                            .appendTo(a);
            }
        });
    }
}


// on page load
$(function () {
    drawSocialLinks();

    if (Simpla.getState().editing) {
        showSettings();
    }            
});