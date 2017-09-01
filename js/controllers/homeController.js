$(() => {
    const app = Sammy('#wrapper', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html', utils.displayHome);
        this.get('#/home', utils.displayHome);
    });

    app.run();
});