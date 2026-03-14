#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program
  .command("build")
  .description("Build Framify CSS")
  .action(async () => {
    const { build } = await import("./build.js");
    await build();
  });

program
  .command("dev")
  .description("Start watch mode")
  .action(async () => {
    const { dev } = await import("./dev.js");
    await dev();
  });

program.command("test").description("Run test").action(async () => {
  console.log("Running test");
});

program.parse();
