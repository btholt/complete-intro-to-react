const test = () => {
  try {
    spinner.succeed(`Detected as running on a ${bold(distro.name)}-based distro.`)
  } catch (e) {}
}
