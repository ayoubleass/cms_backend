const BaseController = require("./BaseController");
const {Project, Result} = require('../../models/associations');

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
                const {keyword, keywordDifficulte, searchVolume, suggestions} = result;
                if (!keyword || !keywordDifficulte || !searchVolume){
                    return res.json({error : 'missing params'});  
                }
                    const suggs = [];
                    const newResult = await Result.create({
                        keyword,
                        keywordDifficulte,
                        searchVolume,
                        ProjectId: id
                    });
                    if (newResult) {
                        if (suggestions && suggestions.length > 0) {
                            for (const suggestion of suggestions){
                                if(!suggestion.keyword || !suggestion.keywordDifficulte || !suggestion.searchVolume) {
                                return res.json({error : "missing param"});
                                }
                                suggs.push(await Result.create({
                                    keyword : suggestion.keyword,
                                    keywordDifficulte : suggestion.keywordDifficulte,
                                    searchVolume :suggestion.searchVolume,
                                    ProjectId :id,
                                    parent_id : newResult.id
                                }));
                            }
                        }
                        newResult.get()['suggestions'] = suggs;
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