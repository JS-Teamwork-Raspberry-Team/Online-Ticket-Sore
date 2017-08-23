$(() => {
    Sammy('#wrapper', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/admin', function (ctx) {
            this.loadPartials({
                header: '../html/common/header.hbs',
                footer: '../html/common/footer.hbs',
                eventList: '../html/admin/eventList.hbs',
                jumbotronSection: '../html/admin/jumbotronSection.hbs'
            }).then(function () {
                this.partial('../html/admin/adminPanel.hbs')
            })
        })

    }).run()
});
