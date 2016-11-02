var fs = require('fs')
var _ = require('lodash')

// TODO:  Add pull from trello
fs.readFile('./data.json','utf8',(err,data)=>{
  var json = JSON.parse(data);

  var cards = json.cards;
  var checklists = json.checklists;
  var lists = json.lists;

  var rows = _.flatten(_.map(cards,(card)=>{
    return _.flatten(_.map(card.idChecklists,(checklistId)=>{
      var list = _.find(lists,(list)=>{ return list.id==card.idList; });
      var checklist = _.find(checklists,(checklist)=>{ return checklist.id==checklistId; });
      return _.map(checklist.checkItems,(item)=>{
        return({
          list: list.name,
          name: card.name,
          checklist: checklist.name,
          item: item.name,
          state: item.state,
        });
      })
    }))
  }));

  console.log(cards[30]);

  var csv = fs.createWriteStream('data.csv');
  csv.write(`"State","List","Name","Checklist","Item"\n`);
  _.each(rows,(row)=>{
    csv.write(`"${row.state}","${row.list}","${row.name}","${row.checklist}","${row.item}"\n`);
  })
  csv.end();
})
