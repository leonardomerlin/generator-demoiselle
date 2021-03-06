'use strict';
var yeoman = require('yeoman-generator');
var cheerio = require('cheerio');
var htmlWiring = require('html-wiring');

module.exports = yeoman.Base.extend({
    prompting: function () {

        var prompts = [{
                type: 'input',
                name: 'name',
                message: 'Qual o nome da nova funcionalidade?'
            }];

        return this.prompt(prompts).then(function (props) {
            this.props = props;
        }.bind(this));
    },
    config: function () {

        var pu = cheerio.load(htmlWiring.readFileAsString('backend/src/main/resources/META-INF/persistence.xml'), {xmlMode: true});
        pu('jta-data-source').after('<class>' + 'app.entity.' + this.props.name + '</class>');
        this.fs.write('backend/src/main/resources/META-INF/persistence.xml', pu.html());

        this.fs.copyTpl(
            this.templatePath('backend/src/main/java/app/business/_pojoBC.java'),
            this.destinationPath('backend/src/main/java/app/business/' + this.props.name + 'BC.java'), {
            name: this.props.name
        }
        );
        this.fs.copyTpl(
            this.templatePath('backend/src/main/java/app/entity/_pojo.java'),
            this.destinationPath('backend/src/main/java/app/entity/' + this.props.name + '.java'), {
            name: this.props.name
        }
        );
        this.fs.copyTpl(
            this.templatePath('backend/src/main/java/app/persistence/_pojoDAO.java'),
            this.destinationPath('backend/src/main/java/app/persistence/' + this.props.name + 'DAO.java'), {
            name: this.props.name
        }
        );
        this.fs.copyTpl(
            this.templatePath('backend/src/main/java/app/service/_pojoREST.java'),
            this.destinationPath('backend/src/main/java/app/service/' + this.props.name + 'REST.java'), {
            name: this.props.name
        }
        );

        this.fs.copyTpl(
            this.templatePath('frontend/app/scripts/controllers/_controller.js'),
            this.destinationPath('frontend/app/scripts/controllers/' + this.props.name.toLowerCase() + '.js'), {
            name: this.props.name
        }
        );

        this.fs.copyTpl(
            this.templatePath('frontend/app/scripts/services/_service.js'),
            this.destinationPath('frontend/app/scripts/services/' + this.props.name.toLowerCase() + '.js'), {
            name: this.props.name
        }
        );

        this.fs.copyTpl(
            this.templatePath('frontend/app/scripts/routes/_route.js'),
            this.destinationPath('frontend/app/scripts/routes/' + this.props.name.toLowerCase() + '.js'), {
            name: this.props.name
        }
        );

        this.fs.copyTpl(this.templatePath('frontend/app/views/view/view-edit.html'),
            this.destinationPath('frontend/app/views/' + this.props.name.toLowerCase() + '/edit.html'), {
            name: this.props.name
        });
        this.fs.copyTpl(this.templatePath('frontend/app/views/view/view-list.html'),
            this.destinationPath('frontend/app/views/' + this.props.name.toLowerCase() + '/list.html'), {
            name: this.props.name
        });

        var pu = cheerio.load(htmlWiring.readFileAsString('frontend/app/index.html'), {xmlMode: false});
        pu('<li><a href="#' + this.props.name.toLowerCase() + '"><i class="glyphicon glyphicon-stats"></i>' + this.props.name + '</a></li>').appendTo('#menu');
        this.fs.write('frontend/app/index.html', pu.html());

    }
});
