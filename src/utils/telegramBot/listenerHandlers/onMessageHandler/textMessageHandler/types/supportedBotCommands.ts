/** Represents the currently supported bot commands */
// TODO: File should be auto generated.
export enum SupportedBotCommands {
  HELP = "help",
}

/** Bot commands that also have a messageTemplate */
export enum BotCommandsWithTemplate {
  HELP = SupportedBotCommands.HELP,
}

/** Represents the type of supported bot commands that have a messageTemplate */
export type BotCommandWithTemplateType = {
  [key in BotCommandsWithTemplate]: string;
};

/** Represents the type of supported bot commands */

export type SupportedBotCommandType = SupportedBotCommands.HELP;
