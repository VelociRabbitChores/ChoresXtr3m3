const db = require('../model/dbModel');

const choreController = {
  // middleware to get all chores from the db
  getChores: (req, res, next) => {
    const text = `SELECT id, chore, room, assigned_user_id 
    FROM chores;`;
    // query the db to get all chores
    db.query(text)
      .then((data) => {
        res.locals.chores = data.rows;
        return next();
      })
      .catch((error) => {
        return next({
          log: 'error in getChores method in choreController',
          message: { error },
        });
      });
  },

  // add a chore to the database
  addChore: (req, res, next) => {
    const { chore, room } = req.body;
    const values = [chore, room];
    const text = `INSERT INTO chores
    (chore, room)
    VALUES ($1, $2);`;

    db.query(text, values)
      .then(() => {
        res.locals.newChore = { chore, room };
        return next();
      })
      .catch((error) => {
        return next({
          log: 'error in addChore method in choreController',
          message: { error },
        });
      });
  },

  // assign or unassign a chore to a user
  updateChore: (req, res, next) => {
    const { choreID, userID, assign } = req.body;
    // console.log('UPDATE CHORE', choreID, userID, assign);
    // declare a null option ID for if we are unassigning and need to change the assigned value to null
    let userIDOption = null;
    res.locals.response = `unassigned chore ${choreID}`;
    if (assign) {
      userIDOption = userID;
      res.locals.response = `assigned chore ${choreID} to user# ${userID}`;
    }

    const text = `UPDATE chores
    SET assigned_user_id=$1
    WHERE id=$2;`; //ID
    const values = [userIDOption, choreID];

    // query the chore db and update the assigned user id
    db.query(text, values)
      .then(() => {
        console.log('successfully assigned chore');
        return next();
      })
      .catch((error) => {
        return next({
          log: 'error when updating chore in updateChore in choreController',
          message: `error: ${error}`,
        });
      });
  },
  // assign or unassign a chore to a user
  reassignChore: (req, res, next) => {
    const { choreID, userID, assign } = req.body;
    // console.log('UPDATE CHORE', choreID, userID, assign);
    // declare a null option ID for if we are unassigning and need to change the assigned value to null
    let userIDOption = null;
    res.locals.response = `unassigned chore ${choreID}`;
    if (assign) {
      userIDOption = userID;
      res.locals.response = `assigned chore ${choreID} to user# ${userID}`;
    }

    const text = `UPDATE chores
      SET assigned_user_id=$1
      WHERE chore=$2;`; //ID
    const values = [userIDOption, choreID];

    // query the chore db and update the assigned user id
    db.query(text, values)
      .then(() => {
        console.log('successfully assigned chore');
        return next();
      })
      .catch((error) => {
        return next({
          log: 'error when updating chore in updateChore in choreController',
          message: `error: ${error}`,
        });
      });
  },
  //delete a room and it's chores from the DB
  deleteRoom: (req, res, next) => {
    const { room } = req.params;
    console.log('you made it!', room);
    const values = [room];
    console.log(room);
    const text = 'DELETE FROM chores WHERE room=$1;';

    db.query(text, values)
      .then(() => {
        res.locals.response = `deleted ${room} from the DB.`;
        return next();
      })
      .catch((error) => {
        return next({
          log: 'error in deleteRoom method in choreController',
          message: { error },
        });
      });
  },
  // delete a chore row from the db
  deleteChore: (req, res, next) => {
    const { chore } = req.params;
    console.log('AM CHORE', chore);
    const text = `DELETE FROM chores
    WHERE chore=$1`;
    const values = [chore];
    db.query(text, values)
      .then(() => {
        res.locals.response = `deleted ${chore} from the DB.`;
        return next();
      })
      .catch((error) => {
        return next({
          log: 'error in deleteChore in choreController',
          message: `error: ${error}`,
        });
      });
  },
};

module.exports = choreController;
