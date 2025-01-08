const BaseController = require("./BaseController");
const {Project, Result, MonthlySearch} = require('../../models/associations');
const sequelize = require('../../db/dbConfig');

class ResultsController extends BaseController {
    static async create (req, res) {
        const t = await sequelize.transaction();
        try {
            const {id} = req.params; 
            const project = await Project.findOne({where : {id , userId : req.user.id}});
            if (project === null || Object.values(project).length < 1) {
                return res.status(404).json({error : `project with id ${id} is not found`});
            } 
            const results = [];
            for (const result of  req.body){
                let {keyword,location, keyword_difficulty, search_volume, suggestions, monthlySearch} = result;
                if (!keyword || search_volume < 0){
                    return res.json({error : 'missing params'}); 

                }
                if(keyword_difficulty instanceof Array) {
                    keyword_difficulty = 0;
                }
                const suggs = [];
                const searches = [];
                const newResult = await Result.create({
                        keyword,
                        locaions : location,
                        keyword_difficulty,
                        search_volume,
                        ProjectId: id
                });
                if (newResult) {
                        if (suggestions && suggestions.length > 0) {
                            for (const suggestion of suggestions){
                                if(!suggestion.keyword || suggestion.search_volume < 0 ) {
                                    return res.json({error : "missing param"});
                                }
                                suggs.push(await Result.create({
                                    keyword : suggestion.keyword,
                                    keyword_difficulty : suggestion.keyword_difficulty,
                                    search_volume :suggestion.search_volume,
                                    ProjectId :id,
                                    parent_id : newResult.id
                                }));
                            }
                        }

                        if (monthlySearch && monthlySearch.length > 0) {     
                            for (const m of monthlySearch){
                                searches.push(MonthlySearch.create({
                                    year: m.year,
                                    search_volume: m.search_volume,
                                    month: m.month,
                                    ResultId : newResult.id,
                                }));
                            }
                        }
                        newResult.get()['suggestions'] = suggs;
                        newResult.get() ['monthlySearch'] = searches;
                }
                results.push(newResult);
            }
            await t.commit();
            return res.status(200).json({results});
        } catch(err){
            await t.rollback();
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }

    }
    static async update (req, res) {
        const t = await sequelize.transaction();
        const { id } = req.params;
        const project = await Project.findOne({ where: { id, userId: req.user.id } });

        if (!project) {
            return res.status(404).json({ error: `Project with id ${id} is not found` });
        }
        const results = [];
        const suggs = [];
        const searches = [];
        try {
            await Result.destroy({
                where: { ProjectId: id }
            });

            await MonthlySearch.destroy({
                where: { ResultId: id }
            });

            for (const result of req.body) {
                let { keyword,location , keyword_difficulty, search_volume, suggestions, monthlySearch, country } = result;
                if(keyword_difficulty instanceof Array) {
                    keyword_difficulty = 0;
                }
                const newResult = await Result.create({
                    keyword,
                    location,
                    keyword_difficulty,
                    search_volume,
                    country,
                    ProjectId: id
                });

                if (suggestions && suggestions.length > 0) {
                    for (const suggestion of suggestions) {
                        suggs.push(await Result.create({
                            keyword: suggestion.keyword,
                            keyword_difficulty: suggestion.keyword_difficulty,
                            search_volume: suggestion.search_volume,
                            ProjectId: id,
                            parent_id: newResult.id
                        }));
                    }
                }
                if (monthlySearch && monthlySearch.length > 0) {
                    for (const m of monthlySearch) {
                        searches.push(await MonthlySearch.create({
                            year: m.year,
                            search_volume: m.search_volume,
                            month: m.month,
                            ResultId: newResult.id,
                        }));
                    }
                }
                newResult.get()['suggestions'] = suggs;
                newResult.get() ['monthlySearch'] = searches;
                results.push(newResult);
            }
            await t.commit();
            return res.status(200).json({results});
        } catch (err) {
            await t.rollback();
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    }

}


module.exports = ResultsController;