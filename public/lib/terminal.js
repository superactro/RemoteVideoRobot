(function() {
  (this.myTerminal = function() {
    var Docker, DockerCommands, Docker_cmd, Docker_logo, EMULATOR_VERSION, bash, commit, commit_containerid, commit_id_does_not_exist, docker_version, help, images, inspect, inspect_no_such_container, inspect_ping_container, parseInput, ping, ps, ps_a, ps_l, pull, pull_no_results, pull_tutorial, pull_ubuntu, push, push_container_learn_ping, push_wrong_name, run_apt_get, run_apt_get_install_iputils_ping, run_apt_get_install_unknown_package, run_cmd, run_flag_defined_not_defined, run_image_wrong_command, run_learn_no_command, run_learn_tutorial_echo_hello_world, run_notfound, run_ping_not_google, run_ping_www_google_com, run_switches, search, search_no_results, search_tutorial, search_ubuntu, testing, util_slow_lines, wait;

    EMULATOR_VERSION = "0.1.3";
    this.basesettings = {
      prompt: 'root@pc:~$ ',
      greetings: "Scarlet Automation virtual terminal."
    };
/*
Callback definitions. These can be overridden by functions anywhere else
*/

this.preventDefaultCallback = false;
this.immediateCallback = function(command) {
  console.debug("immediate callback from " + command);
};
this.finishedCallback = function(command) {
  console.debug("finished callback from " + command);
};
this.intermediateResults = function(string) {
  console.debug("sent " + string);
};
this.currentDockerPs = "";
/*
Base interpreter
*/

this.interpreter = function(input, term) {
  var DockerCommand, command, description, inputs;

  inputs = input.split(" ");
  command = inputs[0];

  socket.emit('TerminalInput', command);

  if (command === 'hi') 
  {
    term.echo('hi there! What is your name??');
    term.push(function(command, term) {
      return term.echo(command + ' is a pretty name');
    });
  }

  socket.on('TerminalAnswer', function(data) 
  {
    term.echo(data);
  });

  return immediateCallback(inputs);
};

/*  =======================================
Common utils
=======================================
*/

String.prototype.beginsWith = function(string) {
/*
Check if 'this' string starts with the inputstring.
*/
return this.indexOf(string) === 0;
};
Array.prototype.containsAllOfThese = function(inputArr) {
/*
This function compares all of the elements in the inputArr
and checks them one by one if they exist in 'this'. When it
finds an element to not exist, it returns false.
*/

var me, valid;

me = this;
valid = false;
if (inputArr) {
  valid = inputArr.every(function(value) {
    if (me.indexOf(value) === -1) {
      return false;
    } else {
      return true;
    }
  });
}
return valid;
};
Array.prototype.containsAllOfTheseParts = function(inputArr) {
/*
This function is like containsAllofThese, but also matches partial strings.
*/

var me, valid;

me = this;
if (inputArr) {
  valid = inputArr.every(function(value) {
    var item, _i, _len;

    for (_i = 0, _len = me.length; _i < _len; _i++) {
      item = me[_i];
      if (item.match(value)) {
        return true;
      }
    }
    return false;
  });
}
return valid;
};
parseInput = function(inputs) {
  var command, commands, imagename, input, j, parsed_input, switchArg, switchArgs, switches, _i, _len;

  command = inputs[1];
  switches = [];
  switchArg = false;
  switchArgs = [];
  imagename = "";
  commands = [];
  j = 0;
  for (_i = 0, _len = inputs.length; _i < _len; _i++) {
    input = inputs[_i];
    if (input.startsWith('-') && imagename === "") {
      switches.push(input);
      if (switches.length > 0) {
        if (!['-i', '-t', '-d'].containsAllOfThese([input])) {
          switchArg = true;
        }
      }
    } else if (switchArg === true) {
      switchArg = false;
      switchArgs.push(input);
    } else if (j > 1 && imagename === "") {
      imagename = input;
    } else if (imagename !== "") {
      commands.push(input);
    } else {

    }
    j++;
  }
  parsed_input = {
    'switches': switches.sortBy(),
    'switchArgs': switchArgs,
    'imageName': imagename,
    'commands': commands
  };
  return parsed_input;
};
util_slow_lines = function(term, paragraph, keyword, finishedCallback) {
  var foo, i, lines;

  if (keyword) {
    lines = paragraph(keyword).split("\n");
  } else {
    lines = paragraph.split("\n");
  }
  term.pause();
  i = 0;
  foo = function(lines) {
    return self.setTimeout((function() {
      if (lines[i]) {
        term.echo(lines[i]);
        i++;
        return foo(lines);
      } else {
        term.resume();
        return finishedCallback();
      }
    }), 1000);
  };
  return foo(lines);
};
wait = function(term, time, dots) {
  var interval_id;

  term.echo("starting to wait");
  interval_id = self.setInterval((function() {
    return dots != null ? dots : term.insert('.');
  }), 500);
  return self.setTimeout((function() {
    var output;

    self.clearInterval(interval_id);
    output = term.get_command();
    term.echo(output);
    return term.echo("done ");
  }), time);
};
/*
Bash program
*/

bash = function(term, inputs) {
  var argument, echo, insert;

  echo = term.echo;
  insert = term.insert;
  if (!inputs[1]) {
    return console.log("none");
  } else {
    argument = inputs[1];
    if (argument.beginsWith('..')) {
      return echo("-bash: cd: " + argument + ": Permission denied");
    } else {
      return echo("-bash: cd: " + argument + ": No such file or directory");
    }
  }
};
/*
Docker program
*/

Docker = function(term, inputs) {
  var DockerCommand, callback, command, commands, description, echo, i, imagename, insert, keyword, parsed_input, result, swargs, switches;

  echo = term.echo;
  insert = term.insert;
  callback = function() {
    return this.finishedCallback(inputs);
  };
  command = inputs[1];
  if (!inputs[1]) {
    console.debug("no args");
    echo(Docker_cmd);
    for (DockerCommand in DockerCommands) {
      description = DockerCommands[DockerCommand];
      echo("[[b;#fff;]" + DockerCommand + "]" + description + "");
    }
  } else if (inputs[1] === "commit") {
    if (inputs.containsAllOfTheseParts(['docker', 'commit', '698', 'learn/ping'])) {
      util_slow_lines(term, commit_containerid, "", callback);
    } else if (inputs.containsAllOfTheseParts(['docker', 'commit', '698'])) {
      util_slow_lines(term, commit_containerid, "", callback);
      intermediateResults(0);
    } else if (inputs.containsAllOfTheseParts(['docker', 'commit']) && inputs[2]) {
      echo(commit_id_does_not_exist(inputs[2]));
    } else {
      echo(commit);
    }
  } else if (inputs[1] === "do") {
    term.push('do', {
      prompt: "do $ "
    });
  } else if (inputs[1] === "logo") {
    echo(Docker_logo);
  } else if (inputs[1] === "images") {
    echo(images);
  } else if (inputs[1] === "inspect") {
    if (inputs[2] && inputs[2].match('ef')) {
      echo(inspect_ping_container);
    } else if (inputs[2]) {
      echo(inspect_no_such_container(inputs[2]));
    } else {
      echo(inspect);
    }
  } else if (command === "ps") {
    if (inputs.containsAllOfThese(['-l'])) {
      echo(ps_l);
    } else if (inputs.containsAllOfThese(['-a'])) {
      echo(ps_a);
    } else {
      echo(currentDockerPs);
    }
  } else if (inputs[1] === "push") {
    if (inputs[2] === "learn/ping") {
      util_slow_lines(term, push_container_learn_ping, "", callback);
      intermediateResults(0);
      return;
    } else if (inputs[2]) {
      echo(push_wrong_name);
    } else {
      echo(push);
    }
  } else if (inputs[1] === "run") {
    parsed_input = parseInput(inputs);
    switches = parsed_input.switches;
    swargs = parsed_input.switchArgs;
    imagename = parsed_input.imageName;
    commands = parsed_input.commands;
    console.log("commands");
    console.log(commands);
    console.log("switches");
    console.log(switches);
    console.log("parsed input");
    console.log(parsed_input);
    console.log("imagename: " + imagename);
    if (imagename === "ubuntu") {
      if (switches.containsAllOfTheseParts(['-i', '-t'])) {
        if (commands.containsAllOfTheseParts(['bash'])) {
          term.push((function(command, term) {
            if (command) {
              echo("this shell is not implemented. Enter 'exit' to exit.");
            }
          }), {
            prompt: 'root@687bbbc4231b:/# '
          });
        } else {
          echo(run_image_wrong_command(commands));
        }
      } else {
        echo(run_flag_defined_not_defined(switches));
      }
    } else if (imagename === "learn/tutorial") {
      if (switches.length > 0) {
        echo(run_learn_no_command);
        intermediateResults(0);
      } else if (commands[0] === "/bin/bash") {
        echo(run_learn_tutorial_echo_hello_world(commands));
        intermediateResults(2);
      } else if (commands[0] === "echo") {
        echo(run_learn_tutorial_echo_hello_world(commands));
      } else if (commands.containsAllOfThese(['apt-get', 'install', '-y', 'iputils-ping'])) {
        echo(run_apt_get_install_iputils_ping);
      } else if (commands.containsAllOfThese(['apt-get', 'install', 'iputils-ping'])) {
        echo(run_apt_get_install_iputils_ping);
      } else if (commands.containsAllOfThese(['apt-get', 'install', 'ping'])) {
        echo(run_apt_get_install_iputils_ping);
      } else if (commands.containsAllOfThese(['apt-get', 'install'])) {
        i = commands.length - 1;
        echo(run_apt_get_install_unknown_package(commands[i]));
      } else if (commands[0] === "apt-get") {
        echo(run_apt_get);
      } else if (commands[0]) {
        echo(run_image_wrong_command(commands[0]));
      } else {
        echo(run_learn_no_command);
      }
    } else if (imagename === "learn/ping") {
      if (commands.containsAllOfTheseParts(["ping", "google.com"])) {
        util_slow_lines(term, run_ping_www_google_com, "", callback);
      } else if (commands[0] === "ping" && commands[1]) {
        echo(run_ping_not_google(commands[1]));
      } else if (commands[0] === "ping") {
        echo(ping);
      } else if (commands[0]) {
        echo("" + commands[0] + ": command not found");
      } else {
        echo(run_learn_no_command);
      }
    } else if (imagename) {
      echo(run_notfound(inputs[2]));
    } else {
      console.log("run");
      echo(run_cmd);
    }
  } else if (inputs[1] === "search") {
    if (keyword = inputs[2]) {
      if (keyword === "ubuntu") {
        echo(search_ubuntu);
      } else if (keyword === "tutorial") {
        echo(search_tutorial);
      } else {
        echo(search_no_results(inputs[2]));
      }
    } else {
      echo(search);
    }
  } else if (inputs[1] === "pull") {
    if (keyword = inputs[2]) {
      if (keyword === 'ubuntu') {
        result = util_slow_lines(term, pull_ubuntu, "", callback);
      } else if (keyword === 'learn/tutorial') {
        result = util_slow_lines(term, pull_tutorial, "", callback);
      } else {
        util_slow_lines(term, pull_no_results, keyword);
      }
    } else {
      echo(pull);
    }
  } else if (inputs[1] === "version") {
    echo(docker_version());
  } else if (DockerCommands[inputs[1]]) {
    echo("" + inputs[1] + " is a valid argument, but not implemented");
  } else {
    echo(Docker_cmd);
    for (DockerCommand in DockerCommands) {
      description = DockerCommands[DockerCommand];
      echo("[[b;#fff;]" + DockerCommand + "]" + description + "");
    }
  }
};
/*
Some default variables / commands

All items are sorted by alphabet
*/

Docker_cmd = "Usage: Docker [OPTIONS] COMMAND [arg...]\n-H=\"127.0.0.1:4243\": Host:port to bind/connect to\n\nA self-sufficient runtime for linux containers.\n\nCommands:\n";
DockerCommands = {
  "attach": "    Attach to a running container",
  "build": "     Build a container from a Dockerfile",
  "commit": "    Create a new image from a container's changes",
  "diff": "      Inspect changes on a container's filesystem",
  "export": "    Stream the contents of a container as a tar archive",
  "history": "   Show the history of an image",
  "images": "    List images",
  "import": "    Create a new filesystem image from the contents of a tarball",
  "info": "      Display system-wide information",
  "insert": "    Insert a file in an image",
  "inspect": "   Return low-level information on a container",
  "kill": "      Kill a running container",
  "login": "     Register or Login to the Docker registry server",
  "logs": "      Fetch the logs of a container",
  "port": "      Lookup the public-facing port which is NAT-ed to PRIVATE_PORT",
  "ps": "        List containers",
  "pull": "      Pull an image or a repository from the Docker registry server",
  "push": "      Push an image or a repository to the Docker registry server",
  "restart": "   Restart a running container",
  "rm": "        Remove a container",
  "rmi": "       Remove an image",
  "run": "       Run a command in a new container",
  "search": "    Search for an image in the Docker index",
  "start": "     Start a stopped container",
  "stop": "      Stop a running container",
  "tag": "       Tag an image into a repository",
  "version": "   Show the Docker version information",
  "wait": "      Block until a container stops, then print its exit code"
};
run_switches = {
  "-p": ['port'],
  "-t": [],
  "-i": [],
  "-h": ['hostname']
};
commit = "Usage: Docker commit [OPTIONS] CONTAINER [REPOSITORY [TAG]]\n\nCreate a new image from a container's changes\n\n  -author=\"\": Author (eg. \"John Hannibal Smith <hannibal@a-team.com>\"\n  -m=\"\": Commit message\n  -run=\"\": Config automatically applied when the image is run. (ex: {\"Cmd\": [\"cat\", \"/world\"], \"PortSpecs\": [\"22\"]}')";
  commit_id_does_not_exist = function(keyword) {
    return "2013/07/08 23:51:21 Error: No such container: " + keyword;
  };
  commit_containerid = "effb66b31edb";
  help = "Docker tutorial \n\nThe Docker tutorial is a Docker emulater intended to help novice users get up to spead with the standard Dockercommands. This terminal contains a limited Docker and a limited shell emulator. Therefore some of the commandsyou would expect do not exist.\n\nJust follow the steps and questions. If you are stuck, click on the 'expected command' to see what the commandshould have been. Leave feedback if you find things confusing.    ";
  images = "ubuntu                latest              8dbd9e392a96        4 months ago        131.5 MB (virtual 131.5 MB)\nlearn/tutorial        latest              8dbd9e392a96        2 months ago        131.5 MB (virtual 131.5 MB)\nlearn/ping            latest              effb66b31edb        10 minutes ago      11.57 MB (virtual 143.1 MB)";
  inspect = "\nUsage: Docker inspect CONTAINER|IMAGE [CONTAINER|IMAGE...]\n\nReturn low-level information on a container/image\n";
  inspect_no_such_container = function(keyword) {
    return "Error: No such image: " + keyword;
  };
  inspect_ping_container = "[2013/07/30 01:52:26 GET /v1.3/containers/efef/json\n{\n  \"ID\": \"efefdc74a1d5900d7d7a74740e5261c09f5f42b6dae58ded6a1fde1cde7f4ac5\",\n  \"Created\": \"2013-07-30T00:54:12.417119736Z\",\n  \"Path\": \"ping\",\n  \"Args\": [\n      \"www.google.com\"\n  ],\n  \"Config\": {\n      \"Hostname\": \"efefdc74a1d5\",\n      \"User\": \"\",\n      \"Memory\": 0,\n      \"MemorySwap\": 0,\n      \"CpuShares\": 0,\n      \"AttachStdin\": false,\n      \"AttachStdout\": true,\n      \"AttachStderr\": true,\n      \"PortSpecs\": null,\n      \"Tty\": false,\n      \"OpenStdin\": false,\n      \"StdinOnce\": false,\n      \"Env\": null,\n      \"Cmd\": [\n          \"ping\",\n          \"www.google.com\"\n      ],\n      \"Dns\": null,\n      \"Image\": \"learn/ping\",\n      \"Volumes\": null,\n      \"VolumesFrom\": \"\",\n      \"Entrypoint\": null\n  },\n  \"State\": {\n      \"Running\": true,\n      \"Pid\": 22249,\n      \"ExitCode\": 0,\n      \"StartedAt\": \"2013-07-30T00:54:12.424817715Z\",\n      \"Ghost\": false\n  },\n  \"Image\": \"a1dbb48ce764c6651f5af98b46ed052a5f751233d731b645a6c57f91a4cb7158\",\n  \"NetworkSettings\": {\n      \"IPAddress\": \"172.16.42.6\",\n      \"IPPrefixLen\": 24,\n      \"Gateway\": \"172.16.42.1\",\n      \"Bridge\": \"docker0\",\n      \"PortMapping\": {\n          \"Tcp\": {},\n          \"Udp\": {}\n      }\n  },\n  \"SysInitPath\": \"/usr/bin/docker\",\n  \"ResolvConfPath\": \"/etc/resolv.conf\",\n  \"Volumes\": {},\n  \"VolumesRW\": {}";
  ping = "Usage: ping [-LRUbdfnqrvVaAD] [-c count] [-i interval] [-w deadline]\n        [-p pattern] [-s packetsize] [-t ttl] [-I interface]\n        [-M pmtudisc-hint] [-m mark] [-S sndbuf]\n        [-T tstamp-options] [-Q tos] [hop1 ...] destination";
  ps = "ID                  IMAGE               COMMAND               CREATED             STATUS              PORTS\nefefdc74a1d5        learn/ping:latest   ping www.google.com   37 seconds ago      Up 36 seconds";
  ps_a = "ID                  IMAGE               COMMAND                CREATED             STATUS              PORTS\n6982a9948422        ubuntu:12.04        apt-get install ping   1 minute ago        Exit 0\nefefdc74a1d5        learn/ping:latest   ping www.google.com   37 seconds ago       Up 36 seconds";
  ps_l = "ID                  IMAGE               COMMAND                CREATED             STATUS              PORTS\n6982a9948422        ubuntu:12.04        apt-get install ping   1 minute ago        Exit 0";
  pull = "Usage: Docker pull NAME\n\nPull an image or a repository from the registry\n\n-registry=\"\": Registry to download from. Necessary if image is pulled by ID\n-t=\"\": Download tagged image in repository";
  pull_no_results = function(keyword) {
    return "Pulling repository " + keyword + "\n2013/06/19 19:27:03 HTTP code: 404";
  };
  pull_ubuntu = "Pulling repository ubuntu from https://index.docker.io/v1\nPulling image 8dbd9e392a964056420e5d58ca5cc376ef18e2de93b5cc90e868a1bbc8318c1c (precise) from ubuntu\nPulling image b750fe79269d2ec9a3c593ef05b4332b1d1a02a62b4accb2c21d589ff2f5f2dc (12.10) from ubuntu\nPulling image 27cf784147099545 () from ubuntu";
  pull_tutorial = "Pulling repository learn/tutorial from https://index.docker.io/v1\nPulling image 8dbd9e392a964056420e5d58ca5cc376ef18e2de93b5cc90e868a1bbc8318c1c (precise) from ubuntu\nPulling image b750fe79269d2ec9a3c593ef05b4332b1d1a02a62b4accb2c21d589ff2f5f2dc (12.10) from ubuntu\nPulling image 27cf784147099545 () from tutorial";
  push = "\nUsage: docker push NAME\n\nPush an image or a repository to the registry";
  push_container_learn_ping = "The push refers to a repository [learn/ping] (len: 1)\nProcessing checksums\nSending image list\nPushing repository learn/ping (1 tags)\nPushing 8dbd9e392a964056420e5d58ca5cc376ef18e2de93b5cc90e868a1bbc8318c1c\nImage 8dbd9e392a964056420e5d58ca5cc376ef18e2de93b5cc90e868a1bbc8318c1c already pushed, skipping\nPushing tags for rev [8dbd9e392a964056420e5d58ca5cc376ef18e2de93b5cc90e868a1bbc8318c1c] on {https://registry-1.docker.io/v1/repositories/learn/ping/tags/latest}\nPushing a1dbb48ce764c6651f5af98b46ed052a5f751233d731b645a6c57f91a4cb7158\nPushing  11.5 MB/11.5 MB (100%)\nPushing tags for rev [a1dbb48ce764c6651f5af98b46ed052a5f751233d731b645a6c57f91a4cb7158] on {https://registry-1.docker.io/v1/repositories/learn/ping/tags/latest}";
  push_wrong_name = "The push refers to a repository [dhrp/fail] (len: 0)";
  run_cmd = "Usage: Docker run [OPTIONS] IMAGE COMMAND [ARG...]\n\nRun a command in a new container\n\n-a=map[]: Attach to stdin, stdout or stderr.\n-c=0: CPU shares (relative weight)\n-d=false: Detached mode: leave the container running in the background\n-dns=[]: Set custom dns servers\n-e=[]: Set environment variables\n-h=\"\": Container host name\n-i=false: Keep stdin open even if not attached\n-m=0: Memory limit (in bytes)\n-p=[]: Expose a container's port to the host (use 'docker port' to see the actual mapping)\n-t=false: Allocate a pseudo-tty\n-u=\"\": Username or UID\n-v=map[]: Attach a data volume\n-volumes-from=\"\": Mount volumes from the specified container";
  run_apt_get = "apt 0.8.16~exp12ubuntu10 for amd64 compiled on Apr 20 2012 10:19:39\nUsage: apt-get [options] command\n       apt-get [options] install|remove pkg1 [pkg2 ...]\n       apt-get [options] source pkg1 [pkg2 ...]\n\napt-get is a simple command line interface for downloading and\ninstalling packages. The most frequently used commands are update\nand install.\n\nCommands:\n   update - Retrieve new lists of packages\n   upgrade - Perform an upgrade\n   install - Install new packages (pkg is libc6 not libc6.deb)\n   remove - Remove packages\n   autoremove - Remove automatically all unused packages\n   purge - Remove packages and config files\n   source - Download source archives\n   build-dep - Configure build-dependencies for source packages\n   dist-upgrade - Distribution upgrade, see apt-get(8)\n   dselect-upgrade - Follow dselect selections\n   clean - Erase downloaded archive files\n   autoclean - Erase old downloaded archive files\n   check - Verify that there are no broken dependencies\n   changelog - Download and display the changelog for the given package\n   download - Download the binary package into the current directory\n\nOptions:\n  -h  This help text.\n  -q  Loggable output - no progress indicator\n  -qq No output except for errors\n  -d  Download only - do NOT install or unpack archives\n  -s  No-act. Perform ordering simulation\n  -y  Assume Yes to all queries and do not prompt\n  -f  Attempt to correct a system with broken dependencies in place\n  -m  Attempt to continue if archives are unlocatable\n  -u  Show a list of upgraded packages as well\n  -b  Build the source package after fetching it\n  -V  Show verbose version numbers\n  -c=? Read this configuration file\n  -o=? Set an arbitrary configuration option, eg -o dir::cache=/tmp\nSee the apt-get(8), sources.list(5) and apt.conf(5) manual\npages for more information and options.\n                       This APT has Super Cow Powers.\n";
  run_apt_get_install_iputils_ping = "Reading package lists...\nBuilding dependency tree...\nThe following NEW packages will be installed:\n  iputils-ping\n0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.\nNeed to get 56.1 kB of archives.\nAfter this operation, 143 kB of additional disk space will be used.\nGet:1 http://archive.ubuntu.com/ubuntu/ precise/main iputils-ping amd64 3:20101006-1ubuntu1 [56.1 kB]\ndebconf: delaying package configuration, since apt-utils is not installed\nFetched 56.1 kB in 1s (50.3 kB/s)\nSelecting previously unselected package iputils-ping.\n(Reading database ... 7545 files and directories currently installed.)\nUnpacking iputils-ping (from .../iputils-ping_3%3a20101006-1ubuntu1_amd64.deb) ...\nSetting up iputils-ping (3:20101006-1ubuntu1) ...";
  run_apt_get_install_unknown_package = function(keyword) {
    return "Reading package lists...\nBuilding dependency tree...\nE: Unable to locate package " + keyword;
  };
  run_flag_defined_not_defined = function(keyword) {
    return "2013/08/15 22:19:14 flag provided but not defined: " + keyword;
  };
  run_learn_no_command = "2013/07/02 02:00:59 Error: No command specified";
  run_learn_tutorial_echo_hello_world = function(commands) {
    var command, string, _i, _len, _ref;

    string = "";
    _ref = commands.slice(1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      command = _ref[_i];
      command = command.replace('"', '');
      string += "" + command + " ";
    }
    return string;
  };
  run_image_wrong_command = function(keyword) {
    return "2013/07/08 23:13:30 Unable to locate " + keyword;
  };
  run_notfound = function(keyword) {
    return "Pulling repository " + keyword + " from https://index.docker.io/v1\n2013/07/02 02:14:47 Error: No such image: " + keyword;
  };
  run_ping_not_google = function(keyword) {
    return "ping: unknown host " + keyword;
  };
  run_ping_www_google_com = "PING www.google.com (74.125.239.129) 56(84) bytes of data.\n64 bytes from nuq05s02-in-f20.1e100.net (74.125.239.148): icmp_req=1 ttl=55 time=2.23 ms\n64 bytes from nuq05s02-in-f20.1e100.net (74.125.239.148): icmp_req=2 ttl=55 time=2.30 ms\n64 bytes from nuq05s02-in-f20.1e100.net (74.125.239.148): icmp_req=3 ttl=55 time=2.27 ms\n64 bytes from nuq05s02-in-f20.1e100.net (74.125.239.148): icmp_req=4 ttl=55 time=2.30 ms\n64 bytes from nuq05s02-in-f20.1e100.net (74.125.239.148): icmp_req=5 ttl=55 time=2.25 ms\n64 bytes from nuq05s02-in-f20.1e100.net (74.125.239.148): icmp_req=6 ttl=55 time=2.29 ms\n64 bytes from nuq05s02-in-f20.1e100.net (74.125.239.148): icmp_req=7 ttl=55 time=2.23 ms\n64 bytes from nuq05s02-in-f20.1e100.net (74.125.239.148): icmp_req=8 ttl=55 time=2.30 ms\n64 bytes from nuq05s02-in-f20.1e100.net (74.125.239.148): icmp_req=9 ttl=55 time=2.35 ms\n-> This would normally just keep going. However, this emulator does not support Ctrl-C, so we quit here.";
  search = "\nUsage: Docker search NAME\n\nSearch the Docker index for images\n";
  search_no_results = function(keyword) {
    return "Found 0 results matching your query (\"" + keyword + "\")\nNAME                DESCRIPTION";
  };
  search_tutorial = "Found 1 results matching your query (\"tutorial\")\nNAME                      DESCRIPTION\nlearn/tutorial            An image for the interactive tutorial";
  search_ubuntu = "Found 22 results matching your query (\"ubuntu\")\nNAME                DESCRIPTION\nshykes/ubuntu\nbase                Another general use Ubuntu base image. Tag...\nubuntu              General use Ubuntu base image. Tags availa...\nboxcar/raring       Ubuntu Raring 13.04 suitable for testing v...\ndhrp/ubuntu\ncreack/ubuntu       Tags:\n12.04-ssh,\n12.10-ssh,\n12.10-ssh-l...\ncrohr/ubuntu              Ubuntu base images. Only lucid (10.04) for...\nknewton/ubuntu\npallet/ubuntu2\nerikh/ubuntu\nsamalba/wget              Test container inherited from ubuntu with ...\ncreack/ubuntu-12-10-ssh\nknewton/ubuntu-12.04\ntithonium/rvm-ubuntu      The base 'ubuntu' image, with rvm installe...\ndekz/build                13.04 ubuntu with build\nooyala/test-ubuntu\nooyala/test-my-ubuntu\nooyala/test-ubuntu2\nooyala/test-ubuntu3\nooyala/test-ubuntu4\nooyala/test-ubuntu5\nsurma/go                  Simple augmentation of the standard Ubuntu...\n";
  testing = "Testing leads to failure, and failure leads to understanding. ~Burt Rutan";
  docker_version = function() {
    return "Docker Emulator version " + EMULATOR_VERSION + "\n\nEmulating:\nClient version: 0.5.3\nServer version: 0.5.3\nGo version: go1.1";
  };
  return Docker_logo = '              _ _       _                    _\n__      _____| | |   __| | ___  _ __   ___  | |\n\\\ \\\ /\\\ / / _ \\\ | |  / _` |/ _ \\\| \'_ \\\ / _ \\\ | |\n \\\ V  V /  __/ | | | (_| | (_) | | | |  __/ |_|\n  \\\_/\\\_/ \\\___|_|_|  \\\__,_|\\\___/|_| |_|\\\___| (_)\n                                              \n\n\n\n                        ##        .\n                  ## ## ##       ==\n               ## ## ## ##      ===\n           /""""""""""""""""\\\___/ ===\n      ~~~ {~~ ~~~~ ~~~ ~~~~ ~~ ~ /  ===- ~~~\n           \\\______ o          __/\n             \\\    \\\        __/\n              \\\____\\\______/\n\n              |          |\n           __ |  __   __ | _  __   _\n          /  \\\| /  \\\ /   |/  / _\\\ |\n          \\\__/| \\\__/ \\\__ |\\\_ \\\__  |\n\n';
})();

return this;

}).call(this);
