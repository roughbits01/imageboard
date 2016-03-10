#!/bin/bash

inotifywait -m -q -e DELETE -e MOVED_FROM -r "/home/azouzim/M2PGI/Web/frontend/www/" --format "%w%f" --excludei '\.(jpg|png|gif|ico|log|sql|zip|gz|pdf|php|swf|ttf|eot|woff|)$' |
	while read file
	do
		if [[ -f $file.gz ]];
		then
			rm $file.gz
		fi
	done
