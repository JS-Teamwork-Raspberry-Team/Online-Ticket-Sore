$(() => {
    Sammy('#wrapper', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/admin', function () {
            this.loadPartials({
                header: '../html/common/header.hbs',
                footer: '../html/common/footer.hbs',
                eventList: '../html/admin/eventList.hbs',
                jumbotronSection: '../html/admin/jumbotronSection.hbs'
            }).then(function () {
                this.partial('../html/admin/adminPanel.hbs')
            })
        });
        
        this.get('#/add-event', function () {
            this.loadPartials({
                header: '../html/common/header.hbs',
                footer: '../html/common/footer.hbs',
                addEventForm: '../html/event/addEventForm.hbs'
            }).then(function () {
                this.partial('../html/event/addEventPage.hbs')
            })
        });

        this.post('#/add-event', function (context) {
            eventService.registerEvent(context)
        });

    }).run()
});
