var config = require('../config');
var file = require('../lib/file');
const gremlin = require('gremlin');
const Gra = gremlin.structure.Graph;
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const graph = new Gra();
const g = graph.traversal().withRemote(new DriverRemoteConnection(config.GDB));
const __ = gremlin.process.statics;

//http://tinkerpop.apache.org/docs/current/reference/
var Graph = /** @class */ (function () {
    function Graph() {
    };
    Graph.prototype.getShares = function (user, pgidx) {
        return g.V().hasLabel(user.ID).outE().order().by('datetime',order.incr).as('x')
                .inV()
                .label().as('a')
                .properties('name').as('b')
                .properties('avatar').as('c')
                .select('c','b','a','x').by('avatar').by('name').by('id').by('datetime').range(pgidx*20,(pgidx+1)*20)
    };
    Graph.prototype.getPosterId = async function (sharedId) {
        const v = await g.V().has('posterid',sharedId).next();
        if(v.value){
            return v.value.label;
        }
        const e = await g.E().hasLabel(sharedId).inV().repeat(__.in_()).until(__.in_().has('posterid')).next();
        if(e.value){
            return e.value.label;
        }
        return null;
    };
    //     edge        vertex         edge
    // ----E(shareid)---->V(userid) ———— E(newShareId)————>
    Graph.prototype.share = async function (user, sharedId) {
        const userId = user.ID;

        const start = await g.V().hasLabel(sharedId).toList();
        if(start.length == 1) {
            const oldShareId = await g.V().hasLabel(sharedId).outE().label().next();
            return oldShareId.value;
        }

        const edge = await g.E().hasLabel(sharedId).toList();
        const vertex = await g.V().hasLabel(userId).toList();
        const newSharedId = file.makeFileDesc('share').fd;

        // E(sharedId) not existed, old PRIOR forwad not existed, so V(user.ID)————E(sharedId<posterid>)————>
        if(edge.length == 0) {
            await g.V().fold().coalesce(__.V().hasLabel(sharedId),__.addV(sharedId).property('posterid',sharedId).property('datetime',(new Date()))).as('poster')
                   .coalesce(__.V().hasLabel(userId),__.addV(userId).property('datetime',(new Date()))).as('me')
                   .addE(newSharedId).from_('poster').to('me').property('datetime',(new Date())).next();
            // E(sharedId) existed, old PRIOR forwad existed, so  ————E(sharedId)————> new V(user.ID)———— new E(newSharedId)————>
        }else {
            // V(user.ID) not existed, so lastShareVertex————E(sharedId)————>new V(user.ID)———— new E(newSharedId)————>
            if(vertex.length == 0){
                //edge[0].label ===  sharedId
                await g.E().hasLabel(sharedId).inV().as('lastShareVertex')
                       .addV(userId).property('datetime',(new Date())).as('me')
                       .addE(newSharedId).from_('lastShareVertex').to('me').property('datetime',(new Date())).next();
            // V(user.ID) existed, need avoid circle
            }else {
                const tofrom = await g.E().hasLabel(sharedId).outV().repeat(__.out()).until(__.hasLabel(userId)).toList();
                const fromto = await g.E().hasLabel(sharedId).inV().repeat(__.in_()).until(__.hasLabel(userId)).toList();
                if(tofrom == 0 && fromto == 0){
                    await g.E().hasLabel(sharedId).inV().as('lastShareVertex')
                           .V().hasLabel(userId).as('me')
                           .addE(newSharedId).from_('lastShareVertex').to('me').property('datetime',(new Date())).next();
                }else {
                    const oldShareId = await g.V().hasLabel(userId).inE().label().next();
                    return oldShareId.value;
                }
            }
        }
        return  newSharedId;       
       
    };
    return Graph;
}());

module.exports = Graph;
