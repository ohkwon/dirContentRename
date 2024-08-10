const file_system = require('fs');

const formatNumToString = (num) => {
    var output = num.toString();
    if (output.length < 2) {
        output = '0' + output;
    }
    return output;
}

const dirCrawler = (baseDir, dirLvl, showName, seasonNum, episodeNumBeg) => {
    const readingDir = baseDir;
    const dirents = file_system.readdirSync(readingDir, {withFileTypes: true});
    var currEpisodeNum = episodeNumBeg;
    var currSeasonNum = seasonNum;
    var currShowName = showName;
    dirents.forEach(dirent => {
        const res = `${readingDir}${dirent.name}`;
        if (dirLvl == 0) {
            currShowName = dirent.name;
            dirCrawler(baseDir + dirent.name + '\\', 1, currShowName, currSeasonNum, episodeNumBeg);
        } else if (dirLvl == 1) {
            const nameArr = dirent.name.split(' ');
            const potentialSeasonNum = parseInt(nameArr.at(-1));
            if (! isNaN(potentialSeasonNum)) {
                currSeasonNum = potentialSeasonNum;
            }
            dirCrawler(baseDir + dirent.name + '\\', 2, currShowName, currSeasonNum, episodeNumBeg);
            currSeasonNum++;
        } else {
            var fileName = dirent.name;
            const fileNameArr = fileName.split('.');
            if (fileNameArr.length < 2) {
                console.log(`Invalid filename: ${baseDir}${fileName}`);
            }
            const extension = '.' + fileNameArr.at(-1);
            var seasonNumStr = formatNumToString(seasonNum);
            var currEpisodeNumStr = formatNumToString(currEpisodeNum);
            const newFileName = `${currShowName} - S${seasonNumStr} Ep ${currEpisodeNumStr}${extension}`;
            console.log(`Rewriting ${baseDir}${fileName} to ${baseDir}${newFileName}`);
            file_system.renameSync(baseDir + fileName, baseDir + newFileName);
            currEpisodeNum++;
        }
    });
}

const processParams = () => {
    var valid = true;
    var seasonNum = 1;
    if (process.argv.length >= 3) {
        seasonNum = parseInt(process.argv[2]);
        if (seasonNum < 0) {
            valid = false;
            console.log(`invalid season num passed (input 1: ${seasonNum})`);
        }
    }
    var episodeNumBeg = 1;
    if (process.argv.length >= 4) {
        episodeNumBeg = parseInt(process.argv.length[3]);
        if (episodeNumBeg < 0) {
            valid = false;
            console.log(`invalid episode num beg passed (input 2: ${episodeNumBeg})`);
        }
    }
    const baseDir = 'C:\\Users\\zacho\\OneDrive\\Documents\\ShowRename\\';
    console.log(`Rewriting Season #${seasonNum} starting Ep #${episodeNumBeg}`);
    dirCrawler(baseDir, 0, "", seasonNum, episodeNumBeg);
}

// dirCrawler('C:\\Users\\zacho\\OneDrive\\Documents\\ShowRename\\');
processParams();