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
                const {keyword, keyword_difficulty, search_volume, suggestions, monthlySearch} = result;
                console.log(keyword_difficulty, keyword, search_volume);
            
                if (!keyword || !search_volume){
                    console.log('missing');
                    return res.json({error : 'missing params'}); 

                }
                const suggs = [];
                const searches = [];
                const newResult = await Result.create({
                        keyword,
                        keyword_difficulty,
                        search_volume,
                        ProjectId: id
                });
                if (newResult) {
                        if (suggestions && suggestions.length > 0) {
                            for (const suggestion of suggestions){
                                if(!suggestion.keyword || !suggestion.search_volume) {
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
        try {
            const {} = req.body;

        }catch (err) {
            console.log (err);
            return res.status(500).json({ error: 'Server error' });
        }
    }
}


module.exports = ResultsController;