import { Command } from "commander";
import { getConfiguration } from "../configuration/getConfiguration";
import { checkout } from "./checkout";
import { commit } from "./commit";
import { showDiff } from "./showDiff";
import { showLog } from "./showLog";
import { showStatus } from "./showStatus";
import { startBranch } from "./startBranch";

export async function startClient(argumentList: string[]): Promise<void> {
  const program = new Command("scion").description("a small source control client");

  program
    .command("new")
    .argument("<branch>")
    .description("start a new branch from this folder")
    .action(startBranch);

  program
    .command("checkout")
    .argument("<branch>")
    .argument("[paths...]", "only these folders")
    .description("download a branch into this folder")
    .action(checkout);

  program.command("status").description("list files changed since checkout").action(showStatus);

  program
    .command("commit")
    .requiredOption("-m, --message <message>", "what the change does")
    .option("-a, --author <author>", "who made the change", getConfiguration().authorName)
    .description("upload changed files and land them on the branch")
    .action((options: { message: string; author: string }) => commit(options.message, options.author));

  program
    .command("log")
    .option("-n, --limit <limit>", "how many changesets to show", "20")
    .description("show the history of this checkout")
    .action((options: { limit: string }) => showLog(Number(options.limit)));

  program.command("diff").argument("<from>").argument("<to>").description("compare two changesets").action(showDiff);

  await program.parseAsync(argumentList);
}
