import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

interface UserAttributes {
  id?: string;
  email: string;
  googleId: string | null;
  calendlyRefreshToken?: string | null;
  slackAccessToken?: string | null;
  slackUserId?: string | null;
  slackIncomingWebhookUrl?: string | null;
  smtpHost?: string | null;
  smtpPort?: number | null;
  smtpUser?: string | null;
  smtpPassword?: string | null;
  lastEventCheckTime?: string;
  cUri?: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public googleId!: string | null;
  public calendlyRefreshToken!: string | null;
  public slackAccessToken!: string | null;
  public slackUserId!: string | null;
  public slackIncomingWebhookUrl!: string | null;
  public smtpHost!: string | null;
  public smtpPort!: number | null;
  public smtpUser!: string | null;
  public smtpPassword!: string | null;
  public lastEventCheckTime!: string;
  public cUri!: string;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    calendlyRefreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    slackAccessToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slackUserId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slackIncomingWebhookUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    smtpHost: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    smtpPort: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    smtpUser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    smtpPassword: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastEventCheckTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cUri: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

export default User;
