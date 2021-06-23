import mongoose, {Schema, model, Document} from 'mongoose';

export interface INotification extends Document{
    type: string;
    description: string;
    status: number;
    origin: string;
    image: string;
    others: string;
    notificationToJSON(): JSON;
}

const notificationSchema = new Schema ({
    type: {type: String},
    description: {type: String},
    status: {type: Number},
    origin: {type: String},
    image: {type: String},
    others: {type: String}
}, {
    timestamps: true,
    versionKey: false
    
});


notificationSchema.methods.notificationToJSON = function(){
    let notification = <INotification>this;
    return{
        type: notification.type,
        description: notification.description,
        status: notification.status,
        origin: notification.origin,
        image: notification.image,
        others: notification.others
    };
}

export default model<INotification>('Notification', notificationSchema);