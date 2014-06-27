module.exports = function(grunt){

    grunt.initConfig({
		  sitemap: {
			  dist: {
				siteRoot: './',
				pattern: 'post/*.md',
				homepage: 'http://blog.imfer.me/#!',
				changefreq: 'weekly',
				priority: '0.5'
			  }
			}

    });
    grunt.loadNpmTasks('grunt-sitemap');
    grunt.registerTask('default',['sitemap']);
};