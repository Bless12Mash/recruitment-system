import {
	EventSubscriber,
	EntitySubscriberInterface,
	UpdateEvent,
	InsertEvent,
} from "typeorm";
import { Candidate } from "../entities/Candidate";

@EventSubscriber()
export class TimestampSubscriber
	implements EntitySubscriberInterface<Candidate>
{
	listenTo() {
		return Candidate;
	}

	beforeInsert(event: InsertEvent<Candidate>) {
		if (event.entity) {
			event.entity.createdAt = new Date();
			event.entity.updatedAt = new Date();
		}
	}

	beforeUpdate(event: UpdateEvent<Candidate>) {
		if (event.entity) {
			event.entity.updatedAt = new Date();
		}
	}
}
