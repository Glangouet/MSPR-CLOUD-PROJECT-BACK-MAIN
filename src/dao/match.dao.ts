import Match from "../models/match";
import Team from "../models/team";

class MatchDao implements DaoInterface {

    private db: any;

    constructor(db: any) {
        this.db = db;
        this.initializeDao();
        this.buildFixtures();
    }

    initializeDao() {
        this.db.run(`
  CREATE TABLE IF NOT EXISTS match(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team1_id INTEGER NOT NULL,
  team2_id INTEGER NOT NULL,
  team1_score INTEGER,
  team2_score INTEGER,
  label VARCHAR,
  start_date TIMESTAMP,
  end_date TIMESTAMP ,
  FOREIGN KEY (team1_id) REFERENCES Team (id),
  FOREIGN KEY (team2_id) REFERENCES Team (id)
  )`
        );
    }

    addMatch(match: Match) {
        console.log(match);
        this.db.run(`INSERT INTO match(team1_id, team2_id, team1_score, team2_score, label, start_date, end_date)
        VALUES(?, ?, ?, ?, ?, ?, ?)`,
            [
                match.team_first.id,
                match.team_second.id,
                match.team_first.score,
                match.team_second.score,
                match.label,
                match.startDate,
                match.endDate
            ],
            (err) => {
           if(err) {
                return console.log(err.message);
            }
            console.log('Match was added to the table');
        })
    }

    getMatchById(id: number) {
        this.db.all(`SELECT * FROM match WHERE id=${id}`, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                console.log(row.label);
            });
        });
    }

    getMatchList(): Promise<Match[]> {
        return new Promise(resolve => {
            this.db.all(`SELECT * FROM match`, [], (err, rows) => {
                if (err) {
                    throw err;
                }
                resolve(rows);
            });
        });
    }

    buildFixtures() {
        const match1 = new Match(new Team(1), new Team(2), 'Quart', new Date().getTime(), new Date().getTime());
        const match2 = new Match(new Team(1), new Team(3), 'Demi', new Date().getTime(), new Date().getTime());
        const match3 = new Match(new Team(2), new Team(3), 'Final', new Date().getTime(), new Date().getTime());
        this.addMatch(match1);
        this.addMatch(match2);
        this.addMatch(match3);
    }

}
export default MatchDao;