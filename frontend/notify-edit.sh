#!/bin/bash

inotifywait -m -q -e CREATE -e MODIFY -e MOVED_TO -r "/home/azouzim/M2PGI/Web/frontend/www/" --format "%w%f" --excludei '\.(jpg|png|gif|ico|log|sql|zip|gz|pdf|php|swf|ttf|eot|woff|)$' |
	while read file
	do
		if [[ $file =~ \.(css|js)$ ]];
		then
		  #yui-compressor -o $file.min $file
			gzip -f -c -6 $file > $file.gz
		elif [[ $file =~ \.(html|xml)$ ]];
		then
			gzip -f -c -6 $file > $file.gz
		fi
	done
