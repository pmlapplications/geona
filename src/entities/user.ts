import 'reflect-metadata';
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: String;

  @Column()
  oauthProvider: string;

  @Column()
  lastLogin: Date;



}

